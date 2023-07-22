import { Group, Text, Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import TerrainStatSummary from '../../components/terrains/TerrainStatSummary';
import { Terrain } from '../../utils/data/terrains';
import { getTerrainByName } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const TerrainName: NextPage = () => {
	const router = useRouter();
	const [terrain, setTerrain] = useState<Terrain | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const terrainName = router.query.name as string;

		if (terrainName !== undefined) {
			if (normalizeName(terrainName) !== terrainName) {
				router.replace('/terrains/[name]', `/terrains/${normalizeName(terrainName)}`);
				return;
			}

			getTerrainByName(terrainName)
				.then((res) => setTerrain(res.data))
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

	if (!terrain) {
		return (
			<>
				<Head>
					<title>CivDB | Terrain not found</title>
				</Head>
				<Title>Sorry, there&apos;s no terrain with that name.</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Terrains</title>
			</Head>
			<Title>{terrain.name}</Title>
			<Group align="baseline" sx={{ justifyContent: 'space-between' }} pr="lg">
				<TerrainStatSummary terrain={terrain} />
				<Text maw="60vw">{terrain.description}</Text>
			</Group>
		</>
	);
};

export default TerrainName;

