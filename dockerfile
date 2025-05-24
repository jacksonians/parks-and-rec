# Step 1: start building image using an official Node image
FROM node:18-alpine

# Step 2: sets working directory 
WORKDIR /app

# Step 3: copies all files from local directory to the working directory
COPY . .

# Step 4: installs package globally using npm
RUN npm install -g http-server

# Step 5: tells Docker the container will listen on port: 8080
EXPOSE 8080

# Step 6: defines the default command to run when server starts
CMD ["http-server", "-p", "8080", "-a", "0.0.0.0"]