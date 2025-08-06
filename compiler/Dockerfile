# node on Debian Slim as the base image
FROM node:18-slim

WORKDIR /app

# Installing system dependencies (for compiling C++ & Java) and cleaning up apt cache
RUN apt-get update && apt-get install -y \
    g++ \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 8000

# Command to start the server
CMD ["node", "index.js"]