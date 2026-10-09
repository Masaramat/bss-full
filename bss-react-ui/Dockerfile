# Step 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]