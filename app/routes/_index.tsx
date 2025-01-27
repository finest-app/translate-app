import {
	Container,
	Card,
	Box,
	Textarea,
	Tooltip,
	CopyButton,
	Stack,
	Group,
	ActionIcon,
	NativeSelect,
} from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconTransfer, IconCopy } from '@tabler/icons-react'
import { useQueryStates } from 'nuqs'
import { useRef, useEffect } from 'react'
import { useFetcher } from 'react-router'
import { useSpinDelay } from 'spin-delay'
import { type Info } from './+types/translate'
import Typewriter from '@/components/Typewriter'
import languages from '@/configs/languages'
import trasnlateSearchParams from '@/configs/trasnlateSearchParams'

type LanguageCode = (typeof languages)[number]['value']

const HomePage = () => {
	const fetcher = useFetcher<Info['loaderData']>()

	const [searchParams, setSearchParams] = useQueryStates(trasnlateSearchParams)

	const submit = useDebouncedCallback(fetcher.submit, 500)

	const initialFetch = useRef(() => {
		if (searchParams.text.trim()) {
			submit(searchParams, { method: 'get', action: '/translate' })
		}
	})

	useEffect(() => {
		initialFetch.current()
	}, [])

	const loading = useSpinDelay(fetcher.state !== 'idle')

	return (
		<Container className="my-auto w-full" size="sm">
			<fetcher.Form method="get" action="/translate">
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

							submit(event.target.form, { method: 'get' })
						}}
					/>
					<Card withBorder>
						<Stack>
							<Group justify="space-between">
								<Group align="center" gap="xs">
									<NativeSelect
										name="source_lang"
										value={searchParams.source_lang}
										data={languages}
										onChange={async (event) => {
											await setSearchParams({
												source_lang: event.target.value as LanguageCode,
											})

											submit(event.target.form)
										}}
									/>
									<Tooltip label="Swap">
										<ActionIcon
											className="stroke-1.5"
											type="button"
											variant="subtle"
											size="lg"
											onClick={async (event) => {
												await setSearchParams({
													source_lang: searchParams.target_lang,
													target_lang: searchParams.source_lang,
												})

												submit((event.target as HTMLElement).closest('form'), {
													method: 'get',
												})
											}}
										>
											<IconTransfer className="stroke-1.5 size-4" />
										</ActionIcon>
									</Tooltip>
									<NativeSelect
										name="target_lang"
										value={searchParams.target_lang}
										data={languages}
										onChange={async (event) => {
											await setSearchParams({
												target_lang: event.target.value as LanguageCode,
											})

											submit(event.target.form)
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
							{fetcher.data && (
								<Box component="output">
									<Typewriter text={fetcher.data} duration={0.5} />
								</Box>
							)}
						</Stack>
					</Card>
				</Stack>
			</fetcher.Form>
		</Container>
	)
}

export default HomePage
