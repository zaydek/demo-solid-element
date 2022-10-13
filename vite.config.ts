import { defineConfig } from "vite"

import unocssPlugin from "unocss/vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		unocssPlugin({
			//// mode: "shadow-dom",
		}),
		solidPlugin({
			hot: false,
		}),
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
})
