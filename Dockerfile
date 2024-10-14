# # Use an official Node.js runtime as a parent image
# FROM node:19.5.0-alpine

# # Set the Node.js memory limit
# ENV NODE_OPTIONS=--max-old-space-size=1906

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of your application code
# COPY . .

# # Build your application (if applicable)
# RUN npm run build

# # Expose the port your app runs on
# EXPOSE 3000

# # Start your application
# CMD ["npm", "start"]



# Stage 1: Build environment
FROM node:alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration file if needed
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
