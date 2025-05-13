
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    cors: true,
    hmr: {
      // Allow all hosts for HMR
      host: 'localhost',
      clientPort: 8080,
    },
    // This is the key fix - explicitly allow all hosts
    fs: {
      strict: false,
      allow: ['.']
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
    cors: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
