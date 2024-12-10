# Dockerfile for JavaScript Front-End
FROM node:14 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

# Use a minimal base image
FROM httpd:alpine
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80
EXPOSE 443

# Start Nginx
# CMD ["nginx", "-g", "daemon off;"]