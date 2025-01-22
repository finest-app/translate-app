import { type Ai } from '@cloudflare/workers-types'

declare module 'react-router' {
	interface AppLoadContext {
		cloudflare: {
			env: {
				AI: Ai
			}
		}
	}
}

export {}
