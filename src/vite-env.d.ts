/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Overrides the chat Worker's address, e.g. http://127.0.0.1:8787 for a local Worker. */
  readonly VITE_CHAT_ENDPOINT?: string;
}
