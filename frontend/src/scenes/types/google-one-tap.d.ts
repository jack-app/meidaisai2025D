// src/types/google-one-tap.d.ts

declare module 'google-one-tap' {
  export interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
  }

  export interface OneTapConfig {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: "signin" | "signup" | "use";
  }

  const googleOneTap: {
    initialize: (config: OneTapConfig) => void;
    prompt: () => void;
  };

  export default googleOneTap;
}
