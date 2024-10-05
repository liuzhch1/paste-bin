<template>
  <div>
    <h1>
      It's too annoying to send files through Airdrop or whatever, so I made
      this.<br />
      Hope you find it useful.
    </h1>
    <br />
    <UButton
      icon="i-lucide:hard-drive-download"
      @click="exportPastes"
      :loading="isExporting"
    >
      {{ isExporting ? 'Exporting...' : 'Export all pastes' }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
interface Paste {
  id: string
  theme: string
  title: string
  content: string
  language: string
  createdAt: string
}

const isExporting = ref(false)

const fetchAllPastes = async (): Promise<Paste[]> => {
  const pageSize = 10
  let page = 0
  let allPastes: Paste[] = []
  let hasMore = true

  while (hasMore) {
    const response = await $fetch('/api/pastes', {
      params: { offset: page * pageSize },
    })

    if (response.pastes.length > 0) {
      allPastes = [...allPastes, ...response.pastes]
      page++
    } else {
      hasMore = false
    }
  }

  return allPastes
}

const exportPastes = async () => {
  try {
    isExporting.value = true
    const allPastes = await fetchAllPastes()

    const now = new Date()
    const formattedDate = now
      .toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/[/:]/g, '-')
      .replace(', ', '-')

    download(
      new Blob([JSON.stringify(allPastes, null, 2)], {
        type: 'application/json',
      }),
      `pastes-${formattedDate}.json`,
      'application/json',
    )
  } catch (error) {
    console.error('Error exporting pastes:', error)
  } finally {
    isExporting.value = false
  }
}

const download = (content: any, fileName: any, contentType: any) => {
  var a = document.createElement('a')
  var file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}
</script>

<style></style>
