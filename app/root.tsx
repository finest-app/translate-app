import { Theme } from '@radix-ui/themes'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { Toaster } from 'sonner'
import './app.css'

export const Layout = () => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>React Router Starter</title>
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<Meta />
				<Links />
			</head>
			<body>
				<NuqsAdapter>
					<Toaster position="top-right" />
					<Theme className="h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
						<Outlet />
					</Theme>
				</NuqsAdapter>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default Outlet
