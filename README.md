# Descbird challange app

This is standard [Nest.js](https://docs.nestjs.com/) application.
As an ORM it uses [Prisma](Prisma).
As a package manager [yarn](https://yarnpkg.com/) was used in the project.

## steps to start application

### 1. Copy parameters from env example file toe .env file
```
cp ./.env.example ./.env
```
### 2. instal packages with yarn
```
yarn install
```
### 3. Run local instance of docker
### 4. To start local db instance run from the project folder command to launch docker compose
```
docker-compose up -d
```
### 5. Make migrations by executing command
```
npx prisma db push
```

### 6. Run application with 
```
yarn start
```

## Notes

- to be able to create bookings it's needed to add users and parking slots directly to DB
- repository contains postman collection which could be added to postman to play around with the api