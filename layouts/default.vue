<template>
  <div>
    <UAlert
      title="Demo pastes will be deleted"
      icon="i-lucide:file-warning"
      color="red"
      variant="solid"
      class="fixed top-0 right-0 m-4"
      style="max-width: 300px"
    >
      <template #title="{ title }">
        <span v-html="title" />
      </template>
      <template #description>
        This is a demo version of the
        <a href="https://github.com/liuzhch1/paste-bin">pastebin</a>.<br />Don't
        put important content here.
      </template>
    </UAlert>
    <header>
      <div class="header-container">
        <div class="header-content">
          <a href="/" class="home-link">J's Pastebin</a>
          <nav>
            <a
              v-for="link in links"
              :key="link.path"
              :href="link.path"
              :aria-current="isCurrentPage(link.path)"
            >
              {{ link.text }}
            </a>
          </nav>
        </div>
        <UTooltip
          text="Search pastes"
          :shortcuts="[metaSymbol, 'K']"
          :popper="{ strategy: 'absolute' }"
        >
          <UButton
            icon="i-lucide:search"
            size="sm"
            variant="ghost"
            @click="isOpen = true"
          />
        </UTooltip>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <UModal v-model="isOpen">
      <UCommandPalette
        placeholder="Search pastes..."
        :groups="groups"
        :empty-state="{
          icon: 'i-heroicons-magnifying-glass-20-solid',
          label: 'Type to search...',
          queryLabel: 'No pastes match your search. Please try again.',
        }"
        @update:model-value="onSelect"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'nuxt/app'
const { metaSymbol } = useShortcuts()

const router = useRouter()

const links = [
  { path: '/', text: 'New' },
  { path: '/pastes', text: 'Pastes' },
  { path: '/about', text: 'About' },
]

const isOpen = ref(false)

const isCurrentPage = (path: string): 'page' | undefined => {
  return router.currentRoute.value.path === path ? 'page' : undefined
}

const groups = computed(() => [
  {
    key: 'search',
    label: 'Search',
    commands: [],
  },
  {
    key: 'pastes',
    label: (q: string) => q && `Pastes matching “${q}”...`,
    search: async (q: string) => {
      if (!q) {
        return []
      }

      const response = await fetch(
        `https://pastebin.liuzhch1.workers.dev/api/search?q=${q}`,
      )
      const pastes = await response.json()
      return pastes.map((paste: any) => ({
        id: paste.item.id,
        label: paste.item.title || 'Untitled',
        suffix: paste.item.content.slice(0, 100),
      }))
    },
  },
])

const onSelect = (option: { id: string }) => {
  isOpen.value = false
  router.push(`/pastes/${option.id}`)
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    },
  },
})
</script>

<style scoped>
.home-link {
  font-size: 1em;
  font-weight: 700;
  margin-right: 1em;
  text-decoration: none;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1em 0.5em;
  box-sizing: border-box;
}

header {
  display: flex;
  padding: 1em;
  padding-bottom: 0.9em;
  border-bottom: 1px dashed rgba(128, 128, 128, 0.49);
}

nav a {
  margin-left: 1rem;
  text-decoration: none;
  line-height: 1.5;
}

nav a:hover {
  text-decoration: underline;
}

nav a[aria-current='page'] {
  text-decoration: underline;
}

main {
  padding: 1rem;
}

main :first-child {
  margin-top: 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.search-input {
  width: 200px;
  font-size: 0.9em;
}
</style>
