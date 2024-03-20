# Setup Local development environment

1. Clone dev repos
   ```sh
   git clone https://github.com/thk-code-arch/intercom-backend.git
   git clone https://github.com/thk-code-arch/intercom-frontend.git
   ```
2. Prepare secrets.env
   ```sh
   vi secrets.env
   ```
3. Start dev environment.
   ```sh
   docker-compose up -d
   ```
4. Run some commands to initialize database
   ```sh
   docker exec -it dev-intercom-backend npm run pretypeorm
   docker exec -it dev-intercom-backend npm run typeorm:migration:run
   docker exec -it dev-intercom-backend npm run seed:run
   ```
