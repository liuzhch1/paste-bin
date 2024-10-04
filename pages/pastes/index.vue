<template>
  <div>
    <h1>All Pastes</h1>
    <div v-for="paste in pastes" :key="paste.id">
      <Paste
        :paste="paste"
        :max-lines="10"
        class="mb-4 p-3 border rounded-md"
      />
    </div>
    <UPagination
      v-model="currentPage"
      :total="total"
      :page-count="limit"
      @update:model-value="onPageChange"
      class="mt-4 flex justify-center mb-4"
    />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

const limit = 10
const currentPage = ref(parseInt(route.query.page as string) || 1)
const totalPages = ref(1)

const { data: pastesData, refresh } = await useFetch('/api/pastes', {
  query: { offset: computed(() => (currentPage.value - 1) * limit) },
})

const pastes = computed(() => pastesData.value?.pastes || [])
const total = computed(() => pastesData.value?.total || 0)

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
