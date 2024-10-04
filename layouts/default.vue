<template>
  <div>
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
        <div class="search-box">
          <UInput
            v-model="searchQuery"
            placeholder="Search pastes..."
            icon="i-heroicons-magnifying-glass-20-solid"
            size="xs"
            style="font-size: 15px"
            :trailing="false"
            @keyup.enter="performSearch"
            class="search-input"
          />
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      links: [
        { path: '/', text: 'New' },
        { path: '/pastes', text: 'Pastes' },
        { path: '/about', text: 'About' },
      ],
      searchQuery: '',
    }
  },
  methods: {
    isCurrentPage(path: string): 'page' | undefined {
      return this.$route.path === path ? 'page' : undefined
    },
    performSearch() {
      // Implement search functionality here
      console.log('Searching for:', this.searchQuery)
      // You might want to navigate to a search results page or update the current page
      // this.$router.push({ path: '/search', query: { q: this.searchQuery } })
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
