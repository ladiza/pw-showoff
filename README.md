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

## Getting Started

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

## Development

- `npm run lint`: Check for code quality issues.
- `npm run format`: Automatically format the codebase.
- `npm run start:backend`: Start the API server independently.
- `npm run start:frontend`: Start the web server independently.
