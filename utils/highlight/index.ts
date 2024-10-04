import { bundledThemesInfo, createHighlighter } from 'shiki'
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import langs from './langs.json'
import themes from './themes.json'
export { langs, themes }
export const langNames = Object.keys(langs)
export const langNameOf = (id: string | null) => {
  if (!id) return null
  return Object.keys(langs).find(
    (key) => langs[key as keyof typeof langs] === id,
  )
}
export const langIdOf = (name: string | null) => {
  if (!name) return null
  return langs[name as keyof typeof langs]
}
export const themesNames = themes
  .map((theme) => bundledThemesInfo.find((t) => t.id === theme)?.displayName)
  .filter((theme) => !!theme) as string[]
export const themeNameOf = (id: string | null) => {
  if (!id) return null
  return bundledThemesInfo.find((theme) => theme.id === id)?.displayName
}
export const themeIdOf = (name: string | null) => {
  if (!name) return null
  return bundledThemesInfo.find((theme) => theme.displayName === name)?.id
}
// Register the languageIds first. Only registered languages will be highlighted.
Object.values(langs).forEach((lang) => {
  monaco.languages.register({ id: lang })
})

export const initMonaco = async () => {
  const highlighter = await createHighlighter({
    themes,
    langs: Object.values(langs),
  })
  shikiToMonaco(highlighter, monaco)
  console.log('Monaco initialized')
}
