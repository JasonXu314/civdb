import { Anchor, AppShell, MantineProvider, Navbar, NavLink } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import Transition from '../components/Transition';
import cache from '../mantine-cache';

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: 'light'
				}}
				emotionCache={cache}>
				<Transition />
				<Notifications position="top-right" />
				<AppShell
					navbar={
						<Navbar maw="min(20vw, 300px)">
							<Navbar.Section>
								<NavLink
									label={
										<Anchor color="black" component={Link} href="/civs">
											Civilizations
										</Anchor>
									}
								/>
							</Navbar.Section>
							<Navbar.Section>
								<NavLink
									label={
										<Anchor color="black" component={Link} href="/units">
											Units
										</Anchor>
									}
								/>
							</Navbar.Section>
						</Navbar>
					}
					fixed
					pl="min(20vw, 300px)">
					<Component {...pageProps} />
				</AppShell>
			</MantineProvider>
		</>
	);
}
