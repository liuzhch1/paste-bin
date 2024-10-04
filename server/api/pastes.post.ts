import { PrismaClient } from '@prisma/client'
import { count } from '../count'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, language, theme } = body
  const paste = await prisma.paste.create({
    data: {
      id: await nextId(),
      title,
      content,
      language,
      theme,
    },
  })
  return paste
})

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
const chars = letters
  .concat(letters.map((l) => l.toUpperCase()))
  .concat([...Array(10).keys()].map((v) => v.toString()))
const idLengths = [...Array(7).keys()]
const idCountThresholds = idLengths.map(
  (length) => (length === 0 ? 0 : Math.pow(chars.length, length) / 3), // TODO: better way to estimate collision rate?
)

const generateId = () => {
  const idLength = idCountThresholds.findIndex((threshold) => threshold > count)
  let num = crypto.getRandomValues(new Uint32Array(1))[0]
  let id = ''
  while (num) {
    id = chars[num % chars.length] + id
    num = Math.floor(num / chars.length)
  }
  id = id.slice(0, idLength)
  while (id.length < idLength) {
    id = chars[Math.floor(Math.random() * chars.length)] + id
  }
  return id
}

const nextId = async () => {
  while (true) {
    const id = generateId()
    const paste = await prisma.paste.findUnique({ where: { id } })
    if (!paste) {
      return id
    }
  }
}
