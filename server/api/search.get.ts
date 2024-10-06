import Fuse from 'fuse.js'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = query.q as string

  if (!searchTerm) {
    return []
  }

  const prisma = new PrismaClient({
    adapter: new PrismaD1(event.context.cloudflare.env.DB),
  })
  const results = await prisma.paste.findMany({
    select: {
      id: true,
      title: true,
      content: true,
    },
  })

  const fuse = new Fuse(results, {
    keys: ['title', 'content'],
    includeScore: true,
    ignoreLocation: true,
  })

  const searchResults = fuse.search(searchTerm)

  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

  return searchResults
})
