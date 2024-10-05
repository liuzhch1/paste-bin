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
const { data: paste, error } = await useFetch(`/api/pastes/${slug}`, {
  key: slug[0],
})
</script>
