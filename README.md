> [!WARNING]
> [This branch](https://github.com/liuzhch1/paste-bin/tree/cloudflare-demo) is deployed on Cloudflare Workers and Pages, in a hurry...
>
> so the code quality, the part of integrating with Cloudflare D1 and Pages, is quite poor.

During the hurry demo deployment, I referred to

https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm

https://nitro.unjs.io/deploy/providers/cloudflare#direct-access-to-cloudflare-bindings

https://www.reddit.com/r/Nuxt/comments/109au1x/comment/l29pxir

# J's Pastebin

It's too annoying to send code snippet files through Airdrop or whatever, so I made this.

Hope you find it useful.

## Deploy

### With Docker

```sh
docker build -t pastebin .
docker run -d -p 3000:3000 pastebin
```

The sqlite file stored in the docker container.

### Locally

```sh
pnpm install
pnpm build
export DATABASE_URL="file:/path/to/sqlite.db"
pnpm prisma generate
pnpm prisma migrate deploy
node .output/server/index.mjs
```

## Tech stack

- [Nuxt 3](https://nuxt.com/) for the frontend and simple backend. [Nuxt UI](https://ui.nuxt.com/) and [Color-Mode](https://color-mode.nuxtjs.org/) plugins are used
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Shiki](https://shiki.matsu.io/) for the syntax highlighting
- [Fuse.js](https://fusejs.io/) for the search functionality
- [Prisma](https://prisma.io/) for the database ORM with SQLite

## Development

```sh
pnpm install
pnpm dev
```
