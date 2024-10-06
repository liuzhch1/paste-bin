import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing paste ID',
    })
  }

  const prisma = new PrismaClient({
    adapter: new PrismaD1(event.context.cloudflare.env.DB),
  })
  const paste = await prisma.paste.findUnique({
    where: { id },
  })

  if (!paste) {
    throw createError({
      statusCode: 410,
      message: 'Paste not found',
    })
  }

  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

  return paste
})
