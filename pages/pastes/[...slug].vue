<template>
  <div v-if="error">
    <div v-if="error.statusCode === 404">
      <NotFound thing="Paste" />
    </div>
    <div v-else>
      <NotFound thing="Paste" />
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
