import { PrismaClient } from '@prisma/client'
import Fuse from 'fuse.js'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = query.q as string

  if (!searchTerm) {
    return []
  }

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

  return searchResults
})
