import { CopyIcon } from '@radix-ui/react-icons'
import {
	Container,
	Flex,
	Card,
	Text,
	Select,
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

type LanguageCode = (typeof languageCodes)[number]

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

	if (input.text.trim() === '') {
		return ''
	}

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
		initialFetch.current()
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

							await fetcher.submit(searchParams, { method: 'post' })
						}}
					/>
				</fetcher.Form>
				<Card>
					<Flex direction="column" gap="2">
						<Flex justify="between">
							<Flex align="center" gap="2">
								<Select.Root
									defaultValue={searchParams.source_lang}
									onValueChange={async (value) => {
										await setSearchParams({
											source_lang: value as LanguageCode,
										})

										await fetcher.submit(
											{ ...searchParams, source_lang: value as LanguageCode },
											{ method: 'post' },
										)
									}}
								>
									<Select.Trigger variant="classic" />
									<Select.Content variant="soft">
										{languages.map((language) => (
											<Select.Item key={language.code} value={language.code}>
												{language.name}
											</Select.Item>
										))}
									</Select.Content>
								</Select.Root>
								<Text>To</Text>
								<Select.Root
									defaultValue={searchParams.target_lang}
									onValueChange={async (value) => {
										await setSearchParams({
											target_lang: value as LanguageCode,
										})

										await fetcher.submit(
											{ ...searchParams, target_lang: value as LanguageCode },
											{ method: 'post' },
										)
									}}
								>
									<Select.Trigger variant="classic" />
									<Select.Content variant="soft">
										{languages.map((language) => (
											<Select.Item key={language.code} value={language.code}>
												{language.name}
											</Select.Item>
										))}
									</Select.Content>
								</Select.Root>
							</Flex>
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
