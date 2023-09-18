include .env

# Just the name
info:
	echo 'Docker Express'

# Start the containers and install dependencies
launch: build start install

build:
	docker build -t ${SERVICE_NAME}:latest .

# Start the containers
start:
	docker compose up -d

# Enter the node container
shell:
	docker exec -it ${SERVICE_NAME} bash

# Install dependencies
install:
	docker exec -it ${SERVICE_NAME} npm install

# Stop the containers
stop:
	docker compose down

reboot: stop start
