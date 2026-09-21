FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY docs ./docs
COPY src ./src

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]