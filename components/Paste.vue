<template>
  <div>
    <div class="title-container">
      <NuxtLink :to="`/pastes/${paste.id}`" class="hover:underline">
        <h1>{{ paste.title === '' ? 'Untitled' : paste.title }}</h1>
      </NuxtLink>
      <UButton
        icon="i-lucide:clipboard-copy"
        size="xs"
        variant="ghost"
        @click="copyToClipboard"
      />
    </div>
    <div
      class="flex justify-between items-center"
      style="padding-bottom: 0.3rem"
    >
      <p class="text-sm text-gray-500">{{ formattedDate }}</p>
      <UButton
        icon="i-lucide:trash-2"
        size="xs"
        variant="ghost"
        @click="deletePaste"
      />
    </div>
    <ClientOnly>
      <div id="monaco-editor-container">
        <div ref="editorContainer"></div>
      </div>
    </ClientOnly>
    <p v-if="isContentTruncated" class="text-sm text-gray-500 mt-2">
      Showing {{ maxLines }} of {{ totalLines }} lines
    </p>
  </div>
</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import { ref, onMounted, nextTick } from 'vue'
import { initMonaco } from '~/utils/highlight'

const props = defineProps<{
  paste: {
    id: string
    title: string
    content: string
    createdAt: string
    language: string
    theme: string
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

const editorContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  await initMonaco()
  if (editorContainer.value) {
    const editor = monaco.editor.create(editorContainer.value, {
      value: displayedContent.value,
      language: props.paste.language,
      readOnly: true,
      scrollbar: {
        vertical: 'hidden',
        useShadows: false,
        handleMouseWheel: false,
      },
      hideCursorInOverviewRuler: true,
      renderLineHighlight: 'none',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      wordWrap: 'on',
      wrappingIndent: 'same',
      automaticLayout: true,
      fontSize: 13,
      fontFamily: 'Roboto Mono',
      fontWeight: 'normal',
      lineNumbersMinChars: 3,
      mouseWheelZoom: false,
      scrollBeyondLastColumn: 0,
    })

    // Adjust editor height based on content
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
    const lineCount = editor.getModel()?.getLineCount() || 0
    const height = lineHeight * lineCount
    editorContainer.value.style.height = `${height}px`

    // Set theme if current url isn't /pastes
    if (window.location.pathname !== '/pastes') {
      monaco.editor.setTheme(props.paste.theme)
    } else {
      const colorMode = useColorMode()
      monaco.editor.setTheme(
        colorMode.value === 'dark' ? defaultDarkTheme.id : defaultLightTheme.id,
      )
      watch(colorMode, (newMode) => {
        monaco.editor.setTheme(
          newMode.value === 'dark' ? defaultDarkTheme.id : defaultLightTheme.id,
        )
      })
    }
  }
})

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

const deletePaste = async () => {
  await $fetch('/api/pastes/' + props.paste.id, {
    method: 'DELETE',
  })
  navigateTo('/pastes')
  useToast().add({
    title: `Paste "${props.paste.title.slice(0, 26)}${
      props.paste.title.length > 26 ? '...' : ''
    }" deleted`,
    timeout: 5000,
    closeButton: {
      icon: '',
    },
  })
}
</script>

<style scoped>
h1 {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 0rem;
}

.title-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.6em;
}
</style>

<style>
/* hide monaco editor cursor */
.monaco-editor .cursors-layer .cursor {
  display: none !important;
}
</style>
