
#Production dockerfile for
FROM node:18-slim as builder
RUN apt-get update \
 && apt-get install -y git unzip

WORKDIR /build

COPY ./apps/backend/builds/IfcConvert.zip .
RUN unzip IfcConvert.zip -d /usr/local/bin && rm IfcConvert.zip

# Stage 2: Setup the intercom-build
FROM node:18-slim as intercom
RUN npm install -g pnpm nodemon


WORKDIR /app

COPY . .
# Install dependencies
RUN pnpm install --frozen-lockfile

# build backend
WORKDIR /app/apps/backend
RUN pnpm run build


# build frontend
WORKDIR /app/apps/frontend
RUN pnpm run build


# Stage 3: Setup intercom
FROM node:18-slim
COPY --from=builder /usr/local/bin/IfcConvert /usr/local/bin/IfcConvert


USER node

COPY --chown=node:node --from=intercom /app/apps/frontend/dist /intercom-frontend
COPY --chown=node:node --from=intercom /app/apps/backend/api /app
COPY CHANGELOG.md /app/CHANGELOG.md



WORKDIR /app
EXPOSE 3000
CMD pnpm run pretypeorm && pnpm run typeorm:migration:run && pnpm run start:prod
