import { Anchor, Stack, Text, Title, Image, Group } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { Civic } from '../../utils/data/civics';
import { getCivics } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const Index: NextPage = () => {
	const [civics, setCivics] = useState<Civic[] | null>(null);

	useEffect(() => {
		getCivics().then((res) => setCivics(res.data));
	}, []);

	return (
		<>
			<Head>
				<title>CivDB | Civics</title>
			</Head>
			<Title mb="lg">Civics</Title>
			<Text>Civics are something</Text>
			<Title mt="lg" id="list" order={2}>
				List of Civics
			</Title>
			{civics === null ? (
				<Text>Loading...</Text>
			) : (
				<Stack>
					{civics.map((civic) => (
						<Anchor key={civic._id} component={Link} href="/civics/[name]" as={`/civics/${normalizeName(civic.name)}`}>
							<Group>
								<Image src={civic.icon} width="50"></Image>
								{civic.name}
							</Group>
						</Anchor>
					))}
				</Stack>
			)}
		</>
	);
};

export default Index;

