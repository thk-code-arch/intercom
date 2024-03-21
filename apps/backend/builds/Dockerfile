#dev dockerfile for intercom-backend
FROM node:18-slim as builder
RUN apt-get update \
 && apt-get install -y git unzip

WORKDIR /build

COPY ./apps/backend/builds/IfcConvert.zip .
RUN unzip IfcConvert.zip -d /usr/local/bin && rm IfcConvert.zip

# Stage 2: Setup the intercom-backend
FROM node:18-slim as intercom-backend
COPY --from=builder /usr/local/bin/IfcConvert /usr/local/bin/IfcConvert
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
