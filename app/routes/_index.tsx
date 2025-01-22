import { Container, Flex, Card, TextArea } from '@radix-ui/themes'
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'
import { useFetcher } from 'react-router'
import { type Route } from './+types/_index'
import languages from '@/configs/languages'

const languageCodes = languages.map((language) => language.code)

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData()

	return formData.get('text')
}

const HomePage = () => {
	const fetcher = useFetcher()

	const [, setSearchParams] = useQueryStates({
		source_lang: parseAsStringEnum(languageCodes).withDefault('en'),
		target_lang: parseAsStringEnum(languageCodes).withDefault('zh'),
		text: parseAsString.withDefault(''),
	})

	return (
		<Container size="2" p="4">
			<Flex direction="column" gap="4">
				<fetcher.Form method="post">
					<TextArea
						name="text"
						size="3"
						radius="full"
						placeholder="Type something..."
						defaultValue={''}
						onChange={async (event) => {
							await setSearchParams({ text: event.target.value })

							await fetcher.submit(event.target.form)
						}}
					/>
				</fetcher.Form>
				{fetcher.state}
				<Card>
					<pre>{fetcher.data}</pre>
				</Card>
			</Flex>
		</Container>
	)
}

export default HomePage
