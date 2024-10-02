<template>
  <div>
    <NuxtLink :to="`/pastes/${paste.id}`" class="text-gray-700 hover:underline">
      <h1>{{ paste.title === '' ? 'Untitled' : paste.title }}</h1>
    </NuxtLink>
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-500">{{ formattedDate }}</p>
      <button @click="copyToClipboard">
        <Icon name="mdi:content-copy" />
      </button>
    </div>
    <pre>{{ displayedContent }}</pre>
    <p v-if="isContentTruncated" class="text-sm text-gray-500 mt-2">
      Showing {{ maxLines }} of {{ totalLines }} lines
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  paste: {
    id: string
    title: string
    content: string
    createdAt: string
  }
  maxLines?: number
}>()

const createdAt = new Date(props.paste.createdAt)
const formattedDate = createdAt.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const totalLines = computed(() => props.paste.content.split('\n').length)
const displayedContent = computed(() => {
  if (!props.maxLines) return props.paste.content
  return props.paste.content.split('\n').slice(0, props.maxLines).join('\n')
})
const isContentTruncated = computed(
  () => props.maxLines && totalLines.value > props.maxLines,
)

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.paste.content)
  const toast = useToast()
  toast.add({
    title: 'Paste copied',
    description: 'Paste copied to your clipboard',
    timeout: 1000,
    closeButton: {
      icon: '',
    },
    icon: 'i-mdi:content-copy',
    click: () => toast.clear(),
    ui: {
      strategy: 'override',
    },
  })
}
</script>

<style scoped>
h1 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.4;
}
</style>
