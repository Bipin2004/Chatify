# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Bundle source
COPY . .

# Production environment
ENV NODE_ENV=production

# Expose port (if you want)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
