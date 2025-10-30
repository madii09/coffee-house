/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_FALLBACK_JSON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
