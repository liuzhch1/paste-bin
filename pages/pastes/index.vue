<template>
  <div>
    <h1>All Pastes</h1>
    <div v-for="paste in pastes" :key="paste.id">
      <Paste
        :paste="paste"
        :max-lines="10"
        class="mb-4 p-4 border rounded-md"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const limit = 10
const currentPage = ref(1)
const totalPages = ref(1)

const { data: pastesData, refresh } = await useFetch('/api/pastes', {
  query: { offset: computed(() => (currentPage.value - 1) * limit) },
})

const pastes = computed(() => pastesData.value?.pastes || [])
const total = computed(() => pastesData.value?.total || 0)

watchEffect(() => {
  totalPages.value = Math.ceil(total.value / limit)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    refresh()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    refresh()
  }
}
</script>
