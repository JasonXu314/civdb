import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import TechListEntry from '../../../components/admin/techs/TechListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledTechnology } from '../../../utils/data/technologies';
import { getTechsData } from '../../../utils/http';

const Index: NextPage = () => {
	const [techs, setTechs] = useState<UnmarshalledTechnology[] | null>(null);

	useEffect(() => {
		getTechsData()
			.then((res) => {
				setTechs(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!techs) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Technologies</title>
				</Head>
				<Title>Loading Technologies...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Technologies</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/technologies/new">
						Create
					</Button>
				</Group>
				{techs.map((tech) => (
					<TechListEntry tech={tech} key={tech._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Units');

