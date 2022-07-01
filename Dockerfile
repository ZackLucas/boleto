## Development
FROM node:14-alpine AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production=false

COPY . .

## Build
FROM development AS build

RUN npm run build

COPY .env ./dist

## Production
FROM node:14-alpine AS production

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production=true

COPY --from=build /usr/app/dist .

EXPOSE 8080
CMD ["node", "/usr/app/main"]
