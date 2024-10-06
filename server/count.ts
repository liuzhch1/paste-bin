import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export let count = 0
let initialized = false

export const initCount = (env: Env) => {
  if (initialized) return
  initialized = true
  setInterval(
    () =>
      new PrismaClient({
        adapter: new PrismaD1(env.DB),
      }).paste
        .count()
        .then((c) => (count = c)),
    5000,
  )
}
