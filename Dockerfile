# build local intercom-frontend for same domain delivery
FROM node:14.5.0-slim as intercom
RUN apt-get update \
 && apt-get install -y git unzip wget
##
WORKDIR /frontend
RUN git clone https://github.com/thk-code-arch/intercom-frontend.git .
RUN npm install && npm run build

WORKDIR /backend
RUN git clone https://github.com/thk-code-arch/intercom-backend.git .
RUN npm install -g @nestjs/cli
RUN cd api && npm install && npm run build

WORKDIR /ifcopenshell
# Download precompiled IFCConvert from IFCOpenBot https://github.com/IfcOpenBot/IfcOpenShell/commits/v0.6.0
RUN wget -O IfcConvert.zip https://s3.amazonaws.com/ifcopenshell-builds/IfcConvert-v0.6.0-ff7219b-linux64.zip
RUN unzip IfcConvert.zip && rm IfcConvert.zip

# keep it small
FROM node:14.5.0-slim as intercom-web
COPY --from=intercom /frontend/dist /intercom-frontend
COPY --from=intercom /ifcopenshell/IfcConvert /usr/local/bin/IfcConvert
COPY --from=intercom /backend/api /app
COPY --from=intercom /backend/files /files

# Create app directory
WORKDIR /app
EXPOSE 3000
CMD npm run pretypeorm && npm run typeorm:migration:run && npm run start:prod
