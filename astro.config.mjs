import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import slugRedirects from "./src/integrations/slug-redirects.mjs";
import { loadEnvFile } from "./scripts/lib/load-env.mjs";

// Vite exposes .env through import.meta.env; the server-side adapter uses process.env.
loadEnvFile();

export default defineConfig({
  site: "https://impactmurals.ae",
  integrations: [slugRedirects()],
  vite: {
    plugins: [tailwindcss()]
  }
});
