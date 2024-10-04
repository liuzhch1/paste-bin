<template>
  <ClientOnly>
    <UInput
      v-model="pasteTitle"
      placeholder="Optional title"
      class="w-full lg:w-60 control-item"
      :style="{ fontSize: '15px' }"
      @update:model-value="updatePasteTitle"
    />
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
      <UButton
        color="white"
        @click="createPaste"
        class="create-button"
        :disabled="!editorContent"
        >Create</UButton
      >
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, onMounted, nextTick } from 'vue'
const colorMode = useColorMode()

const editorInstance = ref<monaco.editor.ITextModel | null>(null)

const currentLanguageId = ref(draftPaste.lang || 'plaintext')
const currentLanguage = ref(langNameOf(currentLanguageId.value) || 'Plain Text')

const currentThemeId = ref(
  draftPaste.theme ||
    (colorMode.value === 'dark' ? defaultDarkTheme.id : defaultLightTheme.id),
)
const currentTheme = ref(
  themeNameOf(currentThemeId.value) ||
    (colorMode.value === 'dark'
      ? defaultDarkTheme.name
      : defaultLightTheme.name),
)
console.log(currentTheme)
console.log(currentThemeId.value, currentTheme.value)
const editorContent = ref(draftPaste.content || '')
const pasteTitle = ref(draftPaste.title || '')

onMounted(async () => {
  // Likely use of <ClientOnly> delays the render of content,
  // so wait for the next DOM update cycle
  await nextTick()
  await initMonaco()
  const container = document.getElementById('monaco-editor-container')
  if (container) {
    editorInstance.value = monaco.editor
      .create(container, {
        value: editorContent.value,
        language: currentLanguageId.value,
        minimap: {
          enabled: false,
        },
        lineNumbers: 'on',
        wordWrap: 'on',
        wrappingIndent: 'same',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'Roboto Mono',
        fontWeight: 'normal',
        lineNumbersMinChars: 3,
        theme: currentThemeId.value,
      })
      .getModel()
    editorInstance.value?.onDidChangeContent(() => {
      if (!editorInstance.value) {
        editorContent.value = ''
      } else {
        editorContent.value =
          monaco.editor.getModel(editorInstance.value.uri)?.getValue() || ''
      }
    })
    editorInstance.value?.onDidChangeLanguage((e) => {
      draftPaste.lang = e.newLanguage
    })
    editorInstance.value?.onDidChangeContent(() => {
      draftPaste.content = editorContent.value
    })
  } else {
    console.error('Monaco editor container not found')
  }
})

const updatePasteTitle = (title: string) => {
  draftPaste.title = title
}

const updateEditorLanguage = (selectedLang: string) => {
  if (editorInstance.value) {
    const languageId = langIdOf(selectedLang)
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
  const response = await $fetch('/api/pastes', {
    method: 'POST',
    body: {
      title: pasteTitle.value,
      content: paste,
      language: currentLanguageId.value,
      theme: currentThemeId.value,
    },
  })
  draftPaste.clear()
  navigateTo(`/pastes/${response.id}`)
}

// Update the updateEditorTheme function to consider the color mode
const updateEditorTheme = (selectedTheme: string, auto: boolean = false) => {
  currentTheme.value = selectedTheme
  let targetThemeId = themeIdOf(selectedTheme)

  if (!targetThemeId) {
    console.error(`Theme not found ${selectedTheme}`)
    return
  }
  currentThemeId.value = targetThemeId
  monaco.editor.setTheme(targetThemeId)

  // If the theme change due to color mode change, don't save it
  if (!auto) {
    draftPaste.theme = targetThemeId
  }
}

watch(colorMode, (newColorMode) => {
  if (draftPaste.theme) {
    return
  }
  if (colorMode.value) {
    const newTheme =
      newColorMode.value === 'dark' ? 'GitHub Dark' : 'GitHub Light'
    updateEditorTheme(newTheme, true)
  }
})
</script>

<style scoped>
#monaco-editor-container {
  min-height: 432px;
  margin-top: 0.5rem;
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
