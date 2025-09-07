// Utilitário para logs seguros que não expõem dados em produção
const isDevelopment = import.meta.env.MODE === "development";

export const secureLog = {
  // Log apenas em desenvolvimento
  dev: {
    log: (...args: any[]) => {
      if (isDevelopment) {
        console.log(...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDevelopment) {
        console.warn(...args);
      }
    },
    error: (...args: any[]) => {
      if (isDevelopment) {
        console.error(...args);
      }
    },
  },

  // Log sempre (apenas para erros críticos do sistema)
  critical: {
    error: (...args: any[]) => {
      console.error("[CRITICAL]", ...args);
    },
  },
};
