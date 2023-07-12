# ⚡️ Super Reliable API ⚡️

### 📦 1. Installation

[pnpm](https://pnpm.io/) is required to install dependencies. Install it with `npm i -g pnpm`.

```bash
pnpm install
```

### 🌳 2. Set up environment

Copy the `.env.example` file to `.env` and update the values as required.

```bash
cp env.example .env
```

### ⛓️ 3. Start up services

[docker](https://docs.docker.com/desktop/install/mac-install/) has been used to setup the required services, however, you can use your own services if you wish.
Simply replace the values stored in `.env` with your own.

```bash
docker compose up -d
```

### 💿 4. Set up the database

[Prisma](https://www.prisma.io) has been used for the ORM. Below are a list commands used to setup the database. 

Once your database is started (see `Start up services` above), you can run the following command to setup the database.

```bash
pnpm db:setup
```

#### 🌱 Seed the database

```bash
pnpm db:seed
```

### 🏃🏼‍♀️ 5. Start the API

The application runs at [http://localhost:3000](http://localhost:3000) by default. You can change this in the `.env` file by setting `PORT`

```bash
pnpm start
```

### 😴 X. Don't wanna do any of that stuff?
```bash 
pnpm setup:everything
```

## 🧪 Run Tests

Jest and Supertest has been chosen for testing. You'll need to ensure you've setup 
and seeded the database locally before running the tests.

```bash
pnpm test
```

## 🧐 Considerations

#### 1. How can we test the code to be confident in the implementation?
To add confidence in the implementation, I've added unit tests using Jest and Supertest.
This allows us to test the code in isolation and also test the API endpoints.
It ensures that the database access for both postgres and redis are working as expected.

#### 2. How can we make sure this code is easy to maintain for future developers?
I've seperated out a lot of the logic into individual files to allow developers
to write isolated tests and also to make it easier to maintain.

#### 3. Our API needs to be high-performance — how can we measure the performance of our API?
Something like [k6](https://k6.io/) could be used as a way to measure the performance
of the API. Introducing something like prometheus, or integrating with a service like
datadog could also be good ways to monitor the application in a live environment.


#### 4. How could we optimise this code if the API receives many more POST requests than GET requests? What about if the API receives many more GET requests than POST requests?
To ensure the API doesn't suffer during high load, I've added in a redis queue (using Bull.js).
In a production environment, I'd typically use something like Google Pub/Sub, or an AWS equivalent.


#### 5. Would any of this logic need to change to scale to millions of simultaneous connections?
With a queue in place, `POST` requests should be fairly well protected, as you could run multiple instances of this service.
`GET` requests would likely suffer. Perhaps introducing a cache that can be invalidated/updated when a new reading is submitted.


## 🕰️ What I would have done differently

- If I were to stick with using an API, I'd either use a framework like NestJS or a more lightweight framework like Fastify. Or, potentially replaced this service with serverless functions.
- I'd have liked to have added in some more tests, particularly around the redis queue.
- Implemented proper logging.
