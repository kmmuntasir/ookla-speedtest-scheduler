FROM node:18.17.1

RUN curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | bash
RUN apt-get install speedtest -y
RUN speedtest --accept-license

WORKDIR /app