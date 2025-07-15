# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy source and build
COPY . .
RUN npm run build

# Serve the built files
CMD ["npm", "run", "preview"]
