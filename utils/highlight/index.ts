import { bundledThemesInfo, createHighlighter } from 'shiki'
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
const { default: langs } = await import('@/utils/highlight/langs.json')
const { default: themes } = await import('@/utils/highlight/themes.json')
export { langs, themes }
export const langNames = Object.keys(langs)
export const themesNames = themes
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

export const initMonaco = () => {
  shikiToMonaco(highlighter, monaco)
  console.log('Monaco initialized')
}
