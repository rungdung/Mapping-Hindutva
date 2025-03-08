import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

const config = {
  kit: {
    adapter: adapter(),
  },
  extensions: [".svelte", ".md", ".svx"],
  preprocess: [
    vitePreprocess,
    mdsvex({
      extensions: [".md", ".svx"],
    }),
  ],
  compilerOptions: {
    compatibility: {
      componentApi: 4,
    },
  },
};
export default config;
