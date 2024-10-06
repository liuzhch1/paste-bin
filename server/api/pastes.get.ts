import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient({
    adapter: new PrismaD1(event.context.cloudflare.env.DB),
  })
  const query = getQuery(event)
  const offset = parseInt(query.offset as string) || 0
  const limit = 10

  const [pastes, total] = await Promise.all([
    prisma.paste.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.paste.count(),
  ])

  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

  return {
    pastes,
    total,
  }
})
