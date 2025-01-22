import { Container, TextArea } from '@radix-ui/themes'

const HomePage = () => {
	return (
		<Container size="2" p="6">
			<TextArea size="3" radius="full" placeholder="Type something..." />
		</Container>
	)
}

export default HomePage
