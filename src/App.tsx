import "uno.css"

import { customElement } from "solid-element"
import { Accessor, batch, createContext, createSignal, ParentProps, Setter, useContext, VoidProps } from "solid-js"
import { css } from "./css"

////////////////////////////////////////

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"counter-state": CounterStateProps
			"current-count": {}
			"sub-button": {}
			"add-button": {}
		}
	}
}

////////////////////////////////////////

function Button(props: ParentProps<{
	ref?:    (el: HTMLElement) => void
	onClick: (e: MouseEvent) => void

	part?:     string // Shadow DOM
	tabIndex?: number // Accessibility
}>) {
	const [ref, setRef] = createSignal<HTMLElement>()

	return <>
		<div
			{...props}
			ref={el => {
				batch(() => {
					props.ref?.(el)
					setRef(el)
				})
			}}
			onKeyDown={e => {
				if (e.key === " ") {
					e.preventDefault() // Prevent scrolling
					ref()!.click()
				}
			}}
			tabIndex={props.tabIndex ?? 0}
		>
			{props.children}
		</div>
	</>
}

////////////////////////////////////////

const CounterStateContext = createContext<{
	count:    Accessor<number>
	setCount: Setter<number>
}>()

type CounterStateProps = ParentProps<{ ["initial-count"]?: number }>
const CounterStateDefaultProps = { ["initial-count"]: 0 }

customElement("counter-state", CounterStateDefaultProps, (props: CounterStateProps) => {
	console.log(props)
	const [count, setCount] = createSignal(props["initial-count"] as NonNullable<typeof props["initial-count"]>)

	return <>
		<CounterStateContext.Provider value={{ count, setCount }}>
			<slot></slot>
		</CounterStateContext.Provider>
	</>
})

customElement("current-count", {}, () => {
	const ctx = useContext(CounterStateContext)
	if (!ctx) { throw new Error("Missing context: wrap <counter-state>") }
	const { count } = ctx

	return <>
		{count()}
	</>
})

customElement("sub-button", {}, () => {
	const ctx = useContext(CounterStateContext)
	if (!ctx) { throw new Error("Missing context: wrap <counter-state>") }
	const { setCount } = ctx

	return <>
		<Button part="button" onClick={e => setCount(curr => curr - 1)}>
			<slot>-</slot>
		</Button>
	</>
})

customElement("add-button", {}, () => {
	const ctx = useContext(CounterStateContext)
	if (!ctx) { throw new Error("Missing context: wrap <counter-state>") }
	const { setCount } = ctx

	return <>
		<Button part="button" onClick={e => setCount(curr => curr + 1)}>
			<slot>+</slot>
		</Button>
	</>
})

////////////////////////////////////////

function CounterApp(props: VoidProps<{ initialCount?: number }>) {
	return <>
		{css`
			.card {
				padding: 16px;
				border-radius: 1000px;
				background-color: white;
				box-shadow: 0 0 0 4px hsl(0 0% 0% / 25%);

				/* Flexbox */
				display: flex;
				flex-direction: row;
				align-items: center; /* Center y-axis */
				gap: 16px;

				-webkit-user-select: none;
				user-select: none;
			}
			:is(sub-button, add-button)::part(button) {
				height: 32px;
				aspect-ratio: 3;
				border-radius: 1000px;
				background-color: lightgray;

				/* CSS Grid*/
				display: grid;
				place-items: center;

				cursor: pointer;
				-webkit-user-select: none;
				user-select: none;
			}
			:is(sub-button, add-button)::part(button):hover:active {
				background-color: gray;
			}
		`}
		<counter-state attr:initial-count={props.initialCount}>
			<div class="card">
				<sub-button></sub-button>
				<current-count></current-count>
				<add-button></add-button>
			</div>
		</counter-state>
	</>
}

export function App() {
	return <>
		<div class="py-64px flex-row flex-justify-center">
			<div class="flex-basis-224px flex-col gap-16px">
				<CounterApp />
				<CounterApp initialCount={10} />
				<CounterApp initialCount={20} />
				<CounterApp initialCount={30} />
				<CounterApp initialCount={40} />
				<CounterApp initialCount={50} />
				<CounterApp initialCount={60} />
				<CounterApp initialCount={70} />
				<CounterApp initialCount={80} />
				<CounterApp initialCount={90} />
			</div>
		</div>
	</>
}
