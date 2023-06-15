import { Anchor, Stack, Text, Title } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { Technology } from '../../utils/data/technologies';
import { getTechs } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const Index: NextPage = () => {
	const [techs, setTechs] = useState<Technology[] | null>(null);

	useEffect(() => {
		getTechs().then((res) => setTechs(res.data));
	}, []);

	return (
		<>
			<Head>
				<title>CivDB | Technologies</title>
			</Head>
			<Title mb="lg">Technologies</Title>
			<Text>Technologies are something</Text>
			<Title mt="lg" id="list" order={2}>
				List of Technologies
			</Title>
			{techs === null ? (
				<Text>Loading...</Text>
			) : (
				<Stack>
					{techs.map((civic) => (
						<Anchor key={civic._id} component={Link} href="/technologies/[name]" as={`/technologies/${normalizeName(civic.name)}`}>
							{civic.name}
						</Anchor>
					))}
				</Stack>
			)}
		</>
	);
};

export default Index;

