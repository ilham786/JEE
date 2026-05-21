// Type declarations for Tauri API modules used by the IPC bridge
// These are minimal fallbacks for local development when @tauri-apps/api isn't installed

declare module "@tauri-apps/api/core" {
  export function invoke<T = any>(cmd: string, args?: Record<string, any>): Promise<T>;
}

declare module "@tauri-apps/api/fs" {
  export function write(path: string, contents: string, options?: any): Promise<void>;
  export const BaseDirectory: any;
}

declare module "@tauri-apps/api/window" {
  export const appWindow: {
    minimize(): Promise<void>;
    maximize?(): Promise<void>;
    unmaximize?(): Promise<void>;
    close?(): Promise<void>;
  };
}

declare module "@tauri-apps/api/process" {
  export function exit(code?: number): Promise<void>;
}
