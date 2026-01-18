import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// const envVars = ["API_URL", "VITE_PORT"];

// const missingEnvVars = envVars.filter((envVar) => !process.env[envVar]);
// if (missingEnvVars.length > 0) {
//   console.log(`try something like this: 👉 API_URL='http://localhost:12345' npm run dev:local 👈`);
//   throw new Error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
// }

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.VITE_PORT),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
