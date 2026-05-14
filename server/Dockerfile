FROM node:20-alpine AS base
WORKDIR /app

# Instala dependências de produção
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copia código fonte
COPY . .

EXPOSE 3000

# Roda migrations e inicia o servidor
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]
