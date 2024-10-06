<template>
  <div v-if="error">
    <div v-if="error.statusCode === 410">
      <NotFound thing="Paste" />
    </div>
    <div v-else>
      <div class="flex flex-col items-center">
        <h1>An error occurred</h1>
        <p>{{ error.message }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="paste">
    <Paste :paste="paste" />
  </div>
</template>

<script lang="ts" setup>
const { slug } = useRoute().params
const paste = ref<any>(null)
const error = ref<any>(null)

const fetchPaste = async () => {
  const response = await fetch(
    `https://pastebin.liuzhch1.workers.dev/api/pastes/${slug}`,
  )
  if (response.ok) {
    paste.value = await response.json()
  } else {
    error.value = {
      statusCode: response.status,
      message: response.statusText,
    }
  }
}

onMounted(fetchPaste)
</script>
