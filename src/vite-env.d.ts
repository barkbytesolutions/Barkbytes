/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The chat Worker's /chat URL. Leave unset to hide the chat. */
  readonly VITE_CHAT_ENDPOINT?: string;
}
