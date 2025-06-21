# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Run stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
