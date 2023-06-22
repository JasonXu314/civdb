import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import TerrainListEntry from '../../../components/admin/terrains/TerrainListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledTerrain } from '../../../utils/data/terrains';
import { getTerrainsData } from '../../../utils/http';

const Index: NextPage = () => {
	const [terrains, setTerrains] = useState<UnmarshalledTerrain[] | null>(null);

	useEffect(() => {
		getTerrainsData()
			.then((res) => {
				setTerrains(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!terrains) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Terrains</title>
				</Head>
				<Title>Loading Terrains...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Terrains</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/terrains/new">
						Create
					</Button>
				</Group>
				{terrains.map((terrain) => (
					<TerrainListEntry terrain={terrain} key={terrain._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Terrains');

