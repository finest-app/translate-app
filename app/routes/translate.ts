import { createLoader } from 'nuqs'
import { data } from 'react-router'
import { type Route } from './+types/translate'
import trasnlateSearchParams from '@/configs/trasnlateSearchParams'

const loadTranslateSearchParams = createLoader(trasnlateSearchParams)

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const input = loadTranslateSearchParams(request)

	if (input.text.trim() === '') {
		return ''
	}

	const response = await context.cloudflare.env.AI.run(
		'@cf/meta/m2m100-1.2b',
		input,
	)

	return data(response.translated_text, {
		headers: {
			'Cache-Control': 'max-age=31536000, immutable',
		},
	})
}
