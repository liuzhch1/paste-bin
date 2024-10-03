import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing paste ID',
    })
  }

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
})
