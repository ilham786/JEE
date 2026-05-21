/**
 * IPC Bridge for Native Integration (Electron/Tauri)
 * Detects and abstracts away OS-level integration for:
 * - Website blocking (native vs simulated)
 * - Process control
 * - File system access
 * - Notifications
 */

export type IPCEnvironment = "browser" | "electron" | "tauri";
export type BlockerMode = "native" | "simulated";

/**
 * Detect runtime environment
 */
function detectEnvironment(): IPCEnvironment {
  if (typeof window === "undefined") return "browser";

  // Check for Tauri
  if ((window as any).__TAURI__) {
    return "tauri";
  }

  // Check for Electron
  if ((window as any).electron || (process as any).versions?.electron) {
    return "electron";
  }

  return "browser";
}

/**
 * Unified IPC interface
 */
export class IPCBridge {
  private environment: IPCEnvironment;
  private blockerMode: BlockerMode;

  constructor() {
    this.environment = detectEnvironment();
    this.blockerMode = this.environment === "browser" ? "simulated" : "native";
  }

  /**
   * Get current runtime environment
   */
  getEnvironment(): IPCEnvironment {
    return this.environment;
  }

  /**
   * Get current blocker mode
   */
  getBlockerMode(): BlockerMode {
    return this.blockerMode;
  }

  /**
   * Check if running in a native environment
   */
  isNativeEnvironment(): boolean {
    return this.environment !== "browser";
  }

  // ===== Distraction Blocker IPC =====

  /**
   * Block a website domain (native)
   */
  async blockWebsite(domain: string): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("block-website", domain);
          return result;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("block_website", { domain });
        return result === true;
      }
    } catch (error) {
      console.error(`Failed to block website ${domain}:`, error);
    }
    return false;
  }

  /**
   * Unblock a website domain
   */
  async unblockWebsite(domain: string): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("unblock-website", domain);
          return result;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("unblock_website", { domain });
        return result === true;
      }
    } catch (error) {
      console.error(`Failed to unblock website ${domain}:`, error);
    }
    return false;
  }

  /**
   * Get list of blocked websites from native side
   */
  async getBlockedWebsites(): Promise<string[]> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("get-blocked-websites");
          return result || [];
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("get_blocked_websites");
        return result || [];
      }
    } catch (error) {
      console.error("Failed to get blocked websites:", error);
    }
    return [];
  }

  /**
   * Enable Monk Mode at system level (lock app, disable other windows)
   */
  async enableMonkMode(): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("enable-monk-mode");
          return result;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("enable_monk_mode");
        return result === true;
      }
    } catch (error) {
      console.error("Failed to enable Monk Mode:", error);
    }
    return false;
  }

  /**
   * Disable Monk Mode
   */
  async disableMonkMode(): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("disable-monk-mode");
          return result;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("disable_monk_mode");
        return result === true;
      }
    } catch (error) {
      console.error("Failed to disable Monk Mode:", error);
    }
    return false;
  }

  /**
   * Get list of running applications (for distraction detection)
   */
  async getRunningApps(): Promise<string[]> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("get-running-apps");
          return result || [];
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("get_running_apps");
        return result || [];
      }
    } catch (error) {
      console.error("Failed to get running apps:", error);
    }
    return [];
  }

  // ===== Notifications =====

  /**
   * Send native notification
   */
  async sendNotification(title: string, body: string): Promise<void> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          await ipcRenderer.invoke("send-notification", { title, body });
          return;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("send_notification", { title, body });
        return;
      }

      // Fallback to browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  // ===== File System Access =====

  /**
   * Save a file (native or browser download)
   */
  async saveFile(filename: string, content: string): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("save-file", { filename, content });
          return result;
        }
      } else if (this.environment === "tauri") {
        const { write, BaseDirectory } = await import("@tauri-apps/api/fs");
        await write(filename, content, { dir: BaseDirectory.Document });
        return true;
      }

      // Fallback: browser download
      const element = document.createElement("a");
      element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return true;
    } catch (error) {
      console.error("Failed to save file:", error);
    }
    return false;
  }

  // ===== App Lifecycle =====

  /**
   * Minimize app window
   */
  async minimizeWindow(): Promise<void> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          await ipcRenderer.invoke("minimize-window");
        }
      } else if (this.environment === "tauri") {
        const { appWindow } = await import("@tauri-apps/api/window");
        await appWindow.minimize();
      }
    } catch (error) {
      console.error("Failed to minimize window:", error);
    }
  }

  /**
   * Quit app
   */
  async quitApp(): Promise<void> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          await ipcRenderer.invoke("quit-app");
        }
      } else if (this.environment === "tauri") {
        const { exit } = await import("@tauri-apps/api/process");
        await exit(0);
      }
    } catch (error) {
      console.error("Failed to quit app:", error);
    }
  }

  // ===== Emergency Unlock (with cooldown) =====

  /**
   * Request emergency unlock (for Monk Mode or blocking)
   * Returns true if unlocked, false if on cooldown
   */
  async requestEmergencyUnlock(cooldownMinutes: number = 30): Promise<boolean> {
    try {
      if (this.environment === "electron") {
        const ipcRenderer = (window as any).electron?.ipcRenderer;
        if (ipcRenderer) {
          const result = await ipcRenderer.invoke("emergency-unlock", { cooldownMinutes });
          return result;
        }
      } else if (this.environment === "tauri") {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("emergency_unlock", { cooldownMinutes });
        return result === true;
      }
    } catch (error) {
      console.error("Failed to request emergency unlock:", error);
    }
    return false;
  }
}

/**
 * Singleton instance of IPC Bridge
 */
let ipcBridgeInstance: IPCBridge | null = null;

export function getIPCBridge(): IPCBridge {
  if (!ipcBridgeInstance) {
    ipcBridgeInstance = new IPCBridge();
  }
  return ipcBridgeInstance;
}

/**
 * Hook-like function for React components
 */
export function useIPC(): IPCBridge {
  return getIPCBridge();
}
