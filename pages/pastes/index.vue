<template>
  <div>
    <h1>All Pastes</h1>
    <div v-if="pastes === null">Loading...</div>
    <div v-else-if="pastes.length === 0">No pastes available.</div>
    <div v-else>
      <div v-for="paste in pastes" :key="paste.id">
        <Paste
          :paste="paste"
          :max-lines="10"
          class="mb-4 p-2 border border-gray-100 dark:border-gray-800 rounded-md"
        />
      </div>
      <UPagination
        v-if="total > 0"
        v-model="currentPage"
        :total="total"
        :page-count="limit"
        @update:model-value="onPageChange"
        class="mt-4 flex justify-center mb-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

const limit = 10
const currentPage = ref(parseInt(route.query.page as string) || 1)
const totalPages = ref(1)

const pastes = ref<any[] | null>(null)
const total = ref(0)

const fetchPastes = async () => {
  const offset = (currentPage.value - 1) * limit
  const response = await fetch(
    `https://pastebin.liuzhch1.workers.dev/api/pastes?offset=${offset}`,
  )
  const data = await response.json()
  pastes.value = data.pastes
  total.value = data.total
}

onMounted(fetchPastes)

watch(currentPage, fetchPastes)

watchEffect(() => {
  totalPages.value = Math.ceil(total.value / limit)
})

const onPageChange = (page: number) => {
  router.push({ query: { ...route.query, page: page.toString() } })
}
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  padding-bottom: 1rem;
}
</style>
