import { Anchor, Stack, Text, Title, Image, Group } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { Terrain } from '../../utils/data/terrains';
import { getTerrains } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const Index: NextPage = () => {
	const [terrains, setTerrains] = useState<Terrain[] | null>(null);

	useEffect(() => {
		getTerrains().then((res) => setTerrains(res.data));
	}, []);

	return (
		<>
			<Head>
				<title>CivDB | Terrains</title>
			</Head>
			<Title mb="lg">Terrains</Title>
			<Text>Terrains are nothing</Text>
			<Title mt="lg" id="list" order={2}>
				List of terrains
			</Title>
			{terrains === null ? (
				<Text>Loading...</Text>
			) : (
				<Stack>
					{terrains.map((terrain) => (
						<Anchor key={terrain._id} component={Link} href="/terrains/[name]" as={`/terrains/${normalizeName(terrain.name)}`}>
							<Group>
								<Image src={terrain.icon} width="50"></Image>
								{terrain.name}
							</Group>
						</Anchor>
					))}
				</Stack>
			)}
		</>
	);
};

export default Index;

