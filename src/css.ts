import { createMemo, onCleanup } from "solid-js"

export type CSS = ([raw]: TemplateStringsArray) => null

export function createCSS(scope?: HTMLElement, { prepend }: { prepend?: boolean } = {}) {
	const cache = new Map<string, true>()

	function css([raw]: TemplateStringsArray): null {
		const str = createMemo(() => raw) // TODO: Add decomment
		if (cache.has(str())) { return null }

		// Create <style type="text/css">
		const style = document.createElement("style")
		style.setAttribute("type", "text/css")
		style.textContent = str()
		// Define lifecycle methods
		scope ??= document.head // Globally or locally-scoped
		cache.set(str(), true)
		if (prepend) scope!.prepend(style)
		else scope!.append(style)
		onCleanup(() => {
			cache.delete(str())
			style.remove()
		})

		return null
	}

	return css
}

// Globally-scoped
export const css = createCSS()
