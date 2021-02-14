FROM node:alpine AS builder
ARG GITHUB_TOKEN
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run clean
RUN npm run build

FROM node:alpine AS installer
ARG GITHUB_TOKEN
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./.npmrc ./
RUN npm install --production

FROM node:alpine AS runner
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json ./
COPY package-lock.json ./
COPY --from=installer ./app/node_modules ./node_modules
CMD npm start