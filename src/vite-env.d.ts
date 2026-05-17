/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When `"true"`, GA initializes only if `localStorage.dreamyclouds_analytics_consent === "granted"`. */
  readonly VITE_GA_REQUIRE_CONSENT?: string;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
