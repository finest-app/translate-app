import {
	Container,
	Card,
	Text,
	Textarea,
	Tooltip,
	CopyButton,
	Stack,
	Group,
	ActionIcon,
	NativeSelect,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCopy } from '@tabler/icons-react'
import {
	createLoader,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from 'nuqs'
import { useRef, useEffect } from 'react'
import { useFetcher } from 'react-router'
import { useSpinDelay } from 'spin-delay'
import { type Route } from './+types/_index'
import languages from '@/configs/languages'

const languageCodes = languages.map((language) => language.value)

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

	return (
		<Container className="my-auto w-full" size="sm">
			<fetcher.Form method="post">
				<Stack gap="md">
					<Textarea
						name="text"
						size="lg"
						placeholder="Type something..."
						autosize
						rows={1}
						maxRows={12}
						defaultValue={searchParams.text}
						onChange={async (event) => {
							await setSearchParams({ text: event.target.value })

							await fetcher.submit(event.target.form, { method: 'post' })
						}}
					/>
					<Card withBorder>
						<Stack>
							<Group justify="space-between">
								<Group align="center">
									<NativeSelect
										name="source_lang"
										defaultValue={searchParams.source_lang}
										data={languages}
										onChange={async (event) => {
											await setSearchParams({
												source_lang: event.target.value as LanguageCode,
											})

											await fetcher.submit(event.target.form, {
												method: 'post',
											})
										}}
									/>
									<Text>To</Text>
									<NativeSelect
										name="target_lang"
										defaultValue={searchParams.target_lang}
										data={languages}
										onChange={async (event) => {
											await setSearchParams({
												target_lang: event.target.value as LanguageCode,
											})

											await fetcher.submit(event.target.form, {
												method: 'post',
											})
										}}
									/>
								</Group>
								<CopyButton value={fetcher.data as string}>
									{({ copy }) => (
										<Tooltip label="Copy">
											<ActionIcon
												className="stroke-1.5"
												variant="light"
												size="lg"
												loading={loading}
												onClick={() => {
													copy()

													notifications.show({
														message: 'Copied to clipboard',
													})
												}}
											>
												<IconCopy className="stroke-1.5 size-4" />
											</ActionIcon>
										</Tooltip>
									)}
								</CopyButton>
							</Group>
							{fetcher.data && <Text>{fetcher.data}</Text>}
						</Stack>
					</Card>
				</Stack>
			</fetcher.Form>
		</Container>
	)
}

export default HomePage
