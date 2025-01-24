import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import mantineTheme from '@/configs/mantineTheme'

import './app.css'

export const Layout = () => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Translate</title>
				<link rel="icon" type="image/png" href="/favicon.png" />
				<ColorSchemeScript />
				<Meta />
				<Links />
			</head>
			<body>
				<NuqsAdapter>
					<MantineProvider theme={mantineTheme}>
						<Notifications position="top-right" />
						<AppShell
							padding="md"
							className="bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
						>
							<AppShell.Main className="flex">
								<Outlet />
							</AppShell.Main>
						</AppShell>
					</MantineProvider>
				</NuqsAdapter>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default Outlet
