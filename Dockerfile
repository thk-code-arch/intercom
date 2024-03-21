
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
RUN npm install -g pnpm
COPY --from=builder /usr/local/bin/IfcConvert /usr/local/bin/IfcConvert


USER node

WORKDIR /app

# copy /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc /app/CHANGELOG.md .
COPY --chown=node:node --from=intercom /app/node_modules /app/node_modules
COPY --chown=node:node --from=intercom /app/apps/frontend/dist /intercom-frontend
COPY --chown=node:node --from=intercom /app/apps/backend /app/apps/backend


WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
