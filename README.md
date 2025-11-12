# HealthTech Operator Dashboard

- [HealthTech Operator Dashboard](#healthtech-operator-dashboard)
  - [Other documents](#other-documents)
  - [Local Development](#local-development)
    - [Programs needed to run project](#programs-needed-to-run-project)
    - [Installation](#installation)
    - [Run locally](#run-locally)
    - [Linting and formatting](#linting-and-formatting)
    - [Build for Production](#build-for-production)
  - [Deployment](#deployment)
    - [Docker Deployment](#docker-deployment)
    - [DIY Deployment](#diy-deployment)
  - [File structure](#file-structure)

## Other documents

- [Onboarding: READ IF ITS YOUR FIRST TIME OPENING THIS REPO](./docs/onboarding.md)
- [Tech Stack](./docs/tech-stack.md)

## Local Development

### Programs needed to run project

- [node](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)

### Installation

Install the required external dependencies:

```sh
pnpm install
```

### Run locally

Run the dev server:

```sh
pnpm dev
```

### Linting and formatting

Check for linting errors and apply safe fixes:

```sh
pnpm lint
```

Check for formatting errors and apply safe fixes:

```sh
pnpm format
```

Do both in one check:

```sh
pnpm check
```

### Build for Production

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to.

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Folder structure

- `.github/`: GitHub configurations, particularly CI/CD workflows
- `.vscode/`: Local per user workspace settings for those using VSCode
- `app/`: All source code for Healthtech frontend 
	- `components/`: Common components used in multiple pages. 
		- `ui`: Primitive UI components acting as building blocks for larger components, such as header, buttons, and input fields. Most of these originates from shadcn/ui, with some tweaks.
	- `hooks/`: Common React hooks reused in multiple pages
  - `features/`: Subfolders of components grouped by larger feature scopes, such as date-picker and popups.
	- `lib/`: Common variables, functions and types reused in multiple components
  - `i18n/`: Contains language files, states and logic for enabling multi-language support. 
	- `routes/`: The main pages that render as the user navigates the application.
- `public/`: Assets requiring no processing, clients download these files as is.
