const keys = {
  lang: 'paste-bin.editorLanguage',
  theme: 'paste-bin.editorTheme',
  title: 'paste-bin.editorTitle',
  content: 'paste-bin.editorContent',
}

export const draftPaste = {
  get lang(): string | null {
    return localStorage.getItem(keys.lang)
  },
  set lang(value: string) {
    localStorage.setItem(keys.lang, value)
  },
  get theme(): string | null {
    return localStorage.getItem(keys.theme)
  },
  set theme(value: string) {
    localStorage.setItem(keys.theme, value)
  },
  get title(): string | null {
    return localStorage.getItem(keys.title)
  },
  set title(value: string) {
    localStorage.setItem(keys.title, value)
  },
  get content(): string | null {
    return localStorage.getItem(keys.content)
  },
  set content(value: string) {
    localStorage.setItem(keys.content, value)
  },
  clear() {
    Object.values(keys).forEach((key) => {
      localStorage.removeItem(key)
    })
  },
}
