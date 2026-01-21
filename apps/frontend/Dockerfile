FROM node:18-alpine

WORKDIR /app

# Install wget for healthcheck (alpine usually has it)
RUN apk add --no-cache wget

COPY public ./public

EXPOSE 8080

CMD ["npx", "serve", "public", "-l", "8080"]
