import { Title } from '@mantine/core';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function withAuth<P extends JSX.IntrinsicAttributes, IP>(Component: NextPage<P, IP>, loaderTitle: string): NextPage<P, IP> {
	return function WithAuth(props) {
		const router = useRouter();
		const [loading, setLoading] = useState<boolean>(true);
		const [authorized, setAuthorized] = useState<boolean>(false);

		useEffect(() => {
			if (!loading && !authorized) {
				router.replace('/');
			}
		}, [loading, authorized, router]);

		useEffect(() => {
			axios
				.post('/api/auth')
				.then(() => {
					setAuthorized(true);
				})
				.catch(() => {
					setAuthorized(false);
				})
				.finally(() => {
					setLoading(false);
				});
		}, []);

		if (loading) {
			return (
				<>
					<Head>
						<title>{`CivDB | ${loaderTitle}`}</title>
					</Head>
					<Title>Loading...</Title>
				</>
			);
		} else {
			return <Component {...props} />;
		}
	};
}

