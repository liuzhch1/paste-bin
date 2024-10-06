import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

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
    return
  }

  await prisma.paste.delete({
    where: { id },
  })

  setResponseStatus(event, 204)
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
})
