FROM node:22
WORKDIR /paste-bin
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
ENV DATABASE_URL=file:/paste-bin/sqlite.db
RUN echo DATABASE_URL="$DATABASE_URL" > .env
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
CMD ["node", ".output/server/index.mjs"]
