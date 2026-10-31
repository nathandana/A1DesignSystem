FROM node:24-bookworm-slim AS build
WORKDIR /repo
COPY . .
RUN npm ci --ignore-scripts && npm run build:tokens && npm run build --workspace=sce-hub

FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /repo/apps/sce-hub/dist ./dist
COPY --from=build /repo/apps/sce-hub/server ./server
COPY --from=build /repo/apps/sce-hub/src/model.mjs ./src/model.mjs
RUN mkdir /data && chown node:node /data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=5191 SCE_DATA_DIR=/data SCE_ORIGIN=https://sce.a1design.app
EXPOSE 5191
CMD ["node", "server/index.mjs"]
