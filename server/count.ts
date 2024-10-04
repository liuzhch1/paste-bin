import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export let count = 0
setInterval(() => prisma.paste.count().then((c) => (count = c)), 5000)
