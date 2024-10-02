<template>
  <div>
    <header>
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
    }
  },
  methods: {
    isCurrentPage(path: string): 'page' | undefined {
      return this.$route.path === path ? 'page' : undefined
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
  border-bottom: 1px dashed var(--color-gray-20);
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
</style>
