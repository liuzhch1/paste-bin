<template>
  <ClientOnly>
    <div id="monaco-editor-container"></div>
    <div class="editor-controls">
      <USelectMenu
        searchable
        clear-search-on-close
        searchable-placeholder="Search a language..."
        class="w-full lg:w-40 control-item"
        :options="langNames"
        :model-value="currentLanguage"
        @update:model-value="updateEditorLanguage"
      />
      <USelectMenu
        searchable
        clear-search-on-close
        searchable-placeholder="Search a theme..."
        class="w-full lg:w-40 control-item"
        :options="themesNames"
        :model-value="currentTheme"
        @update:model-value="updateEditorTheme"
      />
      <UButton color="white" @click="createPaste" class="create-button"
        >Create</UButton
      >
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import { bundledThemesInfo, createHighlighter } from 'shiki'
import { ref, onMounted, nextTick } from 'vue'

const { default: langs } = await import('@/components/langs.json')
const langNames = Object.keys(langs)
const { default: themes } = await import('@/components/themes.json')
const themesNames = themes
  .map((theme) => bundledThemesInfo.find((t) => t.id === theme)?.displayName)
  .filter((theme) => !!theme) as string[]

// Register the languageIds first. Only registered languages will be highlighted.
Object.values(langs).forEach((lang) => {
  monaco.languages.register({ id: lang })
})

const highlighter = await createHighlighter({
  themes,
  langs: Object.values(langs),
})
shikiToMonaco(highlighter, monaco)

const editorInstance = ref<monaco.editor.ITextModel | null>(null)

const currentLanguage = ref('Plain Text')
const currentLanguageId = ref('plaintext')

onMounted(async () => {
  // Likely use of <ClientOnly> delays the render of content,
  // so wait for the next DOM update cycle
  await nextTick()

  const container = document.getElementById('monaco-editor-container')
  if (container) {
    editorInstance.value = monaco.editor
      .create(container, {
        value: '',
        language: 'plaintext',
        minimap: {
          enabled: false,
        },
        lineNumbers: 'on',
        wordWrap: 'on',
        wrappingIndent: 'same',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 13,
        fontFamily: 'Roboto Mono',
        fontWeight: 'normal',
        lineNumbersMinChars: 3,
      })
      .getModel()
  } else {
    console.error('Monaco editor container not found')
  }
})

const updateEditorLanguage = (selectedLang: string) => {
  if (editorInstance.value) {
    const languageId = langs[selectedLang as keyof typeof langs]
    if (languageId) {
      currentLanguage.value = selectedLang
      currentLanguageId.value = languageId
      const model = editorInstance.value
      if (model) {
        monaco.editor.setModelLanguage(
          monaco.editor.getModel(model.uri)!,
          languageId,
        )
      }
    }
  }
}

const createPaste = async () => {
  if (!editorInstance.value) return
  const paste = monaco.editor.getModel(editorInstance.value.uri)?.getValue()
  const response = await $fetch('/api/paste', {
    method: 'POST',
    body: {
      title: '',
      content: paste,
      language: currentLanguageId.value,
      theme: currentThemeId.value,
    },
  })
  console.log(response)
}

const currentTheme = ref('GitHub Light')
const currentThemeId = ref('github-light')
const updateEditorTheme = (selectedTheme: string) => {
  currentTheme.value = selectedTheme
  const targetThemeId = bundledThemesInfo.find(
    (theme) => theme.displayName === selectedTheme,
  )?.id
  if (!targetThemeId) {
    console.error(`Theme not found ${selectedTheme}`)
    return
  }
  currentThemeId.value = targetThemeId
  monaco.editor.setTheme(targetThemeId)
}
</script>

<style scoped>
#monaco-editor-container {
  width: 100%;
  min-height: 432px;
  border: 1px solid #0000002c;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5rem;
}

.editor-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
}

.control-item {
  flex: 1;
  max-width: 200px;
}

.create-button {
  margin-left: auto;
}
</style>
