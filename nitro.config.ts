//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  preset: 'cloudflare-module',
  experimental: {
    wasm: true,
  },
})