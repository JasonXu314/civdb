import { Group, Text, Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import CivicStatSummary from '../../components/civics/CivicStatSummary';
import { Civic } from '../../utils/data/civics';
import { getCivicByName } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const CivicName: NextPage = () => {
	const router = useRouter();
	const [civic, setCivic] = useState<Civic | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const civicName = router.query.name as string;

		if (civicName !== undefined) {
			if (normalizeName(civicName) !== civicName) {
				router.replace('/civics/[name]', `/civics/${normalizeName(civicName)}`);
				return;
			}

			getCivicByName(civicName)
				.then((res) => setCivic(res.data))
				.finally(() => setLoading(false));
		}
	}, [router]);

	if (loading) {
		return (
			<>
				<Head>
					<title>CivDB | Loading...</title>
				</Head>
				<Title>Loading...</Title>
			</>
		);
	}

	if (!civic) {
		return (
			<>
				<Head>
					<title>CivDB | Civic not found</title>
				</Head>
				<Title>Sorry, there&apos;s no civic with that name.</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Civics</title>
			</Head>
			<Title>{civic.name}</Title>
			<Group align="baseline" sx={{ justifyContent: 'space-around' }}>
				<Text>{civic.description}</Text>
				<CivicStatSummary civic={civic} />
			</Group>
		</>
	);
};

export default CivicName;

