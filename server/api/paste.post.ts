import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, language, theme } = body
  const paste = await prisma.paste.create({
    data: {
      title,
      content,
      language,
      theme,
    },
  })
  return paste
})
