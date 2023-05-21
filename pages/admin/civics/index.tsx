import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import CivicListEntry from '../../../components/admin/civics/CivicListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledCivic } from '../../../utils/data/civics';
import { getCivicsData } from '../../../utils/http';

const Index: NextPage = () => {
	const [civics, setCivics] = useState<UnmarshalledCivic[] | null>(null);

	useEffect(() => {
		getCivicsData()
			.then((res) => {
				setCivics(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!civics) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Civics</title>
				</Head>
				<Title>Loading Civics...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Civics</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/civics/new">
						Create
					</Button>
				</Group>
				{civics.map((civic) => (
					<CivicListEntry civic={civic} key={civic._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Civics');

