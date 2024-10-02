import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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

  return {
    pastes,
    total,
  }
})
