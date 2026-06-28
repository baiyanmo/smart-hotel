/// <reference types="vite/client" />

declare module '*.zip' {
  const url: string
  export default url
}
