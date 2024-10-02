<template>
  <div v-if="error">
    <h1>
      {{ error.statusCode === 404 ? 'Paste not found' : 'An error occurred' }}
    </h1>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Go back to home</NuxtLink>
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
