import { Group, Text, Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import TechStatSummary from '../../components/techs/TechStatSummary';
import { Technology } from '../../utils/data/technologies';
import { getTechByName } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const TechName: NextPage = () => {
	const router = useRouter();
	const [tech, setTech] = useState<Technology | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const techName = router.query.name as string;

		if (techName !== undefined) {
			if (normalizeName(techName) !== techName) {
				router.replace('/technologies/[name]', `/technologies/${normalizeName(techName)}`);
				return;
			}

			getTechByName(techName)
				.then((res) => setTech(res.data))
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

	if (!tech) {
		return (
			<>
				<Head>
					<title>CivDB | Technology not found</title>
				</Head>
				<Title>Sorry, there&apos;s no technology with that name.</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Technologies</title>
			</Head>
			<Title>{tech.name}</Title>
			<Group align="baseline" sx={{ justifyContent: 'space-between' }} pr="lg">
				<TechStatSummary tech={tech} />
				<Text maw="60vw">{tech.description}</Text>
			</Group>
		</>
	);
};

export default TechName;

