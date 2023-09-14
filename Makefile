include .env

# Just the name
info:
	echo 'Docker Express'

# Start the containers
start:
	docker compose up -d
	docker exec -it ${SERVICE_NAME} make speedup

# Enter the node container
shell:
	docker exec -it ${SERVICE_NAME} bash

# Prepare Ookla speed test cli tools
speedup:
	curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | bash
	apt-get install speedtest
	echo "YES" >> yes.txt
	speedtest < yes.txt
	rm yes.txt

# Stop the containers
stop:
	docker compose down

reboot: stop start
