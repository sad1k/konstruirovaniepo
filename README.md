# Microservices Project

This project consists of multiple microservices built with NestJS:
- Auth Service
- Order Service
- Product Service
- Cart Service

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose (for containerized setup)

## Project Structure

```
konstruirovaniepo/
├── AuthService/
├── OrderService/
├── ProductService/
├── CartService/
├── docker-compose.yml
└── package.json
```

## Installation

### Option 1: Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies for all services:
```bash
npm run install:all
```

This command will install dependencies for all microservices concurrently.

### Option 2: Docker Setup

1. Make sure Docker and Docker Compose are installed on your system
2. Clone the repository:
```bash
git clone <repository-url>

```

3. Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

## Running the Project

### Local Development

To start all services simultaneously, run:
```bash
npm run start:all
```

Alternatively, you can start individual services:

- Auth Service:
```bash
npm run start:auth
```

- Order Service:
```bash
npm run start:order
```

- Product Service:
```bash
npm run start:product
```

- Cart Service:
```bash
npm run start:cart
```

## Development

Each service is a separate NestJS application with its own configuration and dependencies. You can find the specific setup instructions and API documentation in each service's directory.

## Dependencies

The project uses the following main dependencies:
- @nestjs/axios: ^4.0.0
- concurrently: ^8.2.2 (for running multiple services)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Add your license information here] 