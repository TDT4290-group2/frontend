# HealthTech Operator Dashboard

- [HealthTech Operator Dashboard](#healthtech-operator-dashboard)
  - [Other documents](#other-documents)
  - [Quick start](#quick-start)
  - [Local Development](#local-development)
    - [Programs needed to run project](#programs-needed-to-run-project)
    - [Installation](#installation)
    - [Run locally](#run-locally)
    - [Linting and formatting](#linting-and-formatting)
    - [Build for Production](#build-for-production)
  - [Deployment](#deployment)
    - [Docker Deployment](#docker-deployment)
    - [Example Deployment of Whole Application Stack](#example-deployment-of-whole-application-stack)
      - [Important Notes About Docker Images for Deployment](#important-notes-about-docker-images-for-deployment)
    - [DIY Deployment](#diy-deployment)
  - [File structure](#file-structure)

## Other documents

- [Onboarding: READ IF ITS YOUR FIRST TIME OPENING THIS REPO](./docs/onboarding.md)
- [Tech Stack](./docs/tech-stack.md)

## Quick start

### Running full HealthTech application stack locally with Docker
The easiest way to run the full HealthTech application stack is with Docker compose
**Note: Requires Docker installed locally**

#### Set up environment variables
Make a copy of the [.env.example](./.env.example) file and rename the new file to *.env*. Remember to change the default password.

#### Run the compose stack
To run the full HealthTech application stack, run
```
docker compose up --build -d
```
**Your application is not ready yet!** You need to seed the database with some data to display.

### Seeding the Database with sample data
First, place your sample data in the *seed* directory as csv-files: *NoiseData.csv*, *DustData.csv*, *VibrationData.csv*
Sample data for the different exposure types can be found [here](https://drive.proton.me/urls/FYRKP45DT8#CyS2vd2gzQHH).

After the data is placed, run 

```sh
docker exec -it timescaledb psql -U postgres -d mydb -f /seed/seed.sql
```
*Please note that seeding the database with the provided files may take a few minutes.*

Also note that you need to change the postgres user from *postgres* and database from *mydb* if you changed the default values from `.env.example`

Now your application is ready! You can open it at http://localhost:8080


## Local Development

### Programs needed to run project

- [node](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)

### Installation

Install the required external dependencies:

```sh
pnpm install
```

### Set the Base URL for the backend
The simplest way is to make a copy of the [.env.example](./.env.example) file and rename the new file to *.env*. Then change the `VITE_BASE_URL` if needed. The default value works with the default value set in the backend repository. 

### Run Locally

Run the dev server:

```sh
pnpm dev
```

### Linting and Formatting

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

### Example Deployment of Whole Application Stack
An example deployment configuration is available in [an example file](docker-compose-deployment-example.yml). 
This configuration uses traefik as a reverse proxy, with letsencrypt as a certificate resolver. 

#### Important Notes About Docker Images for Deployment
The frontend needs to be rebuilt for the correct API URL. This value is taken from the `VITE_BASE_URL` variable in the `.env` file. Also note that both frontend and backend dockerfiles support multi-architecture builds, such as `linux/arm64`, but are not built with this support for the GitHub container registry. Both images need to be rebuilt if this is needed.

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.
Make sure to deploy the output of `pnpm run build`
As this is a single page application (no server-side rendering), we only create a client-side bundle under `build/client/`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   └── client/    # Client-side code
```

## Folder Structure

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
- `seed/`: Seeding script and location to place seeding data. Only relevant if running database with docker compose. 
