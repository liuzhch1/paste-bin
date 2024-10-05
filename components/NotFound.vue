<template>
  <h2>{{ thing }} not found<br />404</h2>
</template>

<script lang="ts" setup>
const props = defineProps<{
  thing: string
}>()
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  text-align: center;
}
</style>
