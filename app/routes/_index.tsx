import { CopyIcon } from '@radix-ui/react-icons'
import {
	Container,
	Flex,
	Card,
	TextArea,
	Tooltip,
	IconButton,
} from '@radix-ui/themes'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import {
	createLoader,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from 'nuqs'
import { useRef, useEffect } from 'react'
import { useFetcher } from 'react-router'
import { toast } from 'sonner'
import { useSpinDelay } from 'spin-delay'
import { type Route } from './+types/_index'
import languages from '@/configs/languages'

const languageCodes = languages.map((language) => language.code)

const trasnlateSearchParams = {
	source_lang: parseAsStringEnum(languageCodes).withDefault('en'),
	target_lang: parseAsStringEnum(languageCodes).withDefault('zh'),
	text: parseAsString.withDefault(''),
}

const loadTranslateSearchParams = createLoader(trasnlateSearchParams)

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData()

	const input = loadTranslateSearchParams(
		Object.fromEntries(formData) as Record<string, string>,
	)

	const response = await context.cloudflare.env.AI.run(
		'@cf/meta/m2m100-1.2b',
		input,
	)

	return response.translated_text
}

const HomePage = () => {
	const fetcher = useFetcher<typeof action>()

	const [searchParams, setSearchParams] = useQueryStates(trasnlateSearchParams)

	const initialFetch = useRef(() => {
		if (searchParams.text.trim()) {
			void fetcher.submit(searchParams, { method: 'post' })
		}
	})

	useEffect(() => {
		void initialFetch.current()
	}, [])

	const loading = useSpinDelay(fetcher.state !== 'idle')

	const [, copyToClipboard] = useCopyToClipboard()

	return (
		<Container size="2" px="4" py="8">
			<Flex direction="column" gap="4">
				<fetcher.Form method="post">
					<TextArea
						name="text"
						size="3"
						radius="full"
						placeholder="Type something..."
						defaultValue={searchParams.text}
						onChange={async (event) => {
							await setSearchParams({ text: event.target.value })

							await fetcher.submit(event.target.form)
						}}
					/>
				</fetcher.Form>
				<Card asChild>
					<Flex direction="column" gap="4">
						<Flex justify="end">
							<Tooltip content="Copy">
								<IconButton
									variant="soft"
									loading={loading}
									onClick={async () => {
										await copyToClipboard(fetcher.data ?? '')

										toast.success('Copied to clipboard')
									}}
								>
									<CopyIcon />
								</IconButton>
							</Tooltip>
						</Flex>
						{fetcher.data}
					</Flex>
				</Card>
			</Flex>
		</Container>
	)
}

export default HomePage
