# Playwright Show-off Project

This vibecoded repository demonstrates automated testing using Playwright for a simple e-commerce application. It includes both UI and API testing, showcasing modern automation patterns.

## Project Structure

- `apps/frontend`: A vanilla JavaScript frontend application.
- `apps/backend`: An Express.js REST API providing product data.
- `tests/ui`: End-to-end tests for the user interface.
- `tests/api`: Integration tests for the REST API.
- `src/`: Page objects, components, and fixtures.
- `packages/utils`: Shared utilities and network mocking helpers.

## Features

- **Page Object Model**: Structured UI interaction logic.
- **Custom Fixtures**: Simplified test setup and improved readability.
- **Network Mocking**: Comprehensive use of Playwright's routing to simulate various API responses and error states.
- **API Testing**: Direct validation of backend services.
- **Biome.js**: Fast linting and formatting for code quality.

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker and Docker Compose (optional, for containerized execution)

## Getting Started

### Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   # Run all tests
   npm test

   # Run UI tests only
   npm run test:e2e

   # Run API tests only
   npm run test:api

   # Open Playwright UI mode
   npm run test:ui
   ```

### Docker Setup

The project includes a Docker Compose setup that automatically handles starting the backend and frontend, performs health checks, and runs tests in a clean environment.

1. **Run all tests in Docker:**
   ```bash
   # Build images and run the entire suite
   docker compose run --rm e2e npx playwright test
   ```

2. **Start application services and run tests:**
   ```bash
   # Start the backend and frontend services
   docker compose up -d backend frontend

   # or rebuild the services after a change
   docker compose up --build -d backend frontend

   # Run tests against the containerized services
   npm test

   # Stop the services after testing
   docker compose down
   ```

3. **View reports:**
   Test reports are automatically written back to your local `playwright-report/` directory thanks to volume mounting. You can view them on your host using:
   ```bash
   npx playwright show-report
   ```

4. **Stop services:**
   ```bash
   docker compose down
   ```

> **Note on Permissions:** If you encounter `Permission denied` errors when running docker commands, try prefixing them with `sudo` or add your user to the `docker` group.

## Development

- `npm run lint`: Check for code quality issues.
- `npm run format`: Automatically format the codebase.
- `npm run start:backend`: Start the API server independently.
- `npm run start:frontend`: Start the web server independently.
