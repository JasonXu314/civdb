import { AppShell, MantineProvider, NativeSelect, Navbar, NavLink } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ExpansionProvider } from '../components/EspansionContext';
import Transition from '../components/Transition';
import cache from '../mantine-cache';

export default function App(props: AppProps) {
	const { Component, pageProps, router } = props;
	const [expansion, setExpansion] = useState<Expansion>('base');

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
						<Navbar maw="min(12.5vw, 300px)">
							<Navbar.Section px="lg" py="sm">
								<NavLink component={Link} label="Civics" href={router.pathname.includes('admin') ? '/admin/civics' : '/civics'} />
								<NavLink
									component={Link}
									label="Technologies"
									href={router.pathname.includes('admin') ? '/admin/technologies' : '/technologies'}
								/>
								<NavLink component={Link} label="Terrains" href={router.pathname.includes('admin') ? '/admin/terrains' : '/terrains'} />
								<NavLink component={Link} label="Units" href={router.pathname.includes('admin') ? '/admin/units' : '/units'} />
							</Navbar.Section>
							<Navbar.Section px="lg" py="sm" mt="auto">
								<NativeSelect
									label="Expansion"
									data={[
										{ label: 'Base Game', value: 'base' },
										{ label: 'Rise & Fall', value: 'rf' },
										{ label: 'Gathering Storm', value: 'gs' }
									]}
									onChange={(evt) => setExpansion(evt.target.value as Expansion)}
								/>
							</Navbar.Section>
						</Navbar>
					}
					fixed
					pl="min(12.5vw, 300px)">
					<ExpansionProvider value={expansion}>
						<Component {...pageProps} />
					</ExpansionProvider>
				</AppShell>
			</MantineProvider>
		</>
	);
}

