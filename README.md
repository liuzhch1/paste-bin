# J's Pastebin


It's too annoying to send code snippet files through Airdrop or whatever, so I made this.

Try it out: https://paste-bin.demos.liuzhch1.com/

## Features

- Dark / Light mode
- Code highlight with themes
- Really short paste link, starting with one letter: `/pastes/a`
- VSCode like editor(Monaco)
- Search all pastes
- Nice looking UI
- Export data supported

## Screenshot
![screenshot](https://github.com/user-attachments/assets/1a1d8199-f65e-4e60-96df-ab3a0886f45a)

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

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fliuzhch1%2Fpaste-bin&count_bg=%23A78BFA&title_bg=%23555555&icon=pastebin.svg&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
