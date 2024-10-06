import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export let count = 0
let initialized = false

export const initCount = (env: Env) => {
  if (initialized) return
  initialized = true
  setInterval(() => {
    const client = new PrismaClient({
      adapter: new PrismaD1(env.DB),
    })
    client.paste.count().then((c) => (count = c))
    if (count > 1000) {
      client.paste.deleteMany({
        where: {
          id: {
            notIn: ['b', 'c', 'p'],
          },
        },
      })
    }
  }, 5000)
}
