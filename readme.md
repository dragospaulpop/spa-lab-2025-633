# Getting Started

## Prerequisites

This project requires [Bun](https://bun.sh) to be installed. Bun is a fast JavaScript runtime, bundler, and package manager.

### Installing Bun

Install Bun using one of the following methods:

**Using the official installer (recommended):**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Using npm:**

```bash
npm install -g bun
```

**Using Homebrew (macOS/Linux):**

```bash
brew install bun
```

For more installation options and platform-specific instructions, visit the [Bun installation guide](https://bun.sh/docs/installation).

## Running the Application

This project consists of a server and a client that need to be run separately.

### Running Postgres in Docker

1. Navigate to the root golder of the project (make sure docker-compsoe.yml is there and make sure Docker Desktop is started):

```bash
docker compose up
```

### Running the Server

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

4. Running migrations:

```bash
bun run db:migrate
```

5. Using Drizzle Studio to manage data:

```bash
bun run db:studio
```

The server will start with hot reload enabled and typically run on `http://localhost:3000`.

### Running the Client

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

The client will start and typically run on `http://localhost:5173` (Vite's default port).

## Development

- The server uses [Hono](https://hono.dev) framework and runs with Bun's hot reload feature.
- The client uses [Vite](https://vite.dev) with React and Tailwind CSS.
- Both servers support hot reload, so changes will be reflected automatically.
