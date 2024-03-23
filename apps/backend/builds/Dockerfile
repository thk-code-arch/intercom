#dev dockerfile for intercom-backend
FROM node:18-slim as builder

RUN npm install -g pnpm nodemon


WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
# Install dependencies
RUN pnpm install --filter backend --frozen-lockfile

# Copy the backend application source
COPY apps/backend ./apps/backend


WORKDIR /app/apps/backend

EXPOSE 3000

# Command to run the app, assuming 'start:dev' is the script in your package.json
CMD ["pnpm", "run", "start:dev"]
