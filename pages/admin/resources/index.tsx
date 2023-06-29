import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import ResourceListEntry from '../../../components/admin/resources/ResourceListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledResource } from '../../../utils/data/resources';
import { getResourcesData } from '../../../utils/http';

const Index: NextPage = () => {
	const [resources, setResources] = useState<UnmarshalledResource[] | null>(null);

	useEffect(() => {
		getResourcesData()
			.then((res) => {
				setResources(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!resources) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Resources</title>
				</Head>
				<Title>Loading Resources...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Resources</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/resources/new">
						Create
					</Button>
				</Group>
				{resources.map((resource) => (
					<ResourceListEntry resource={resource} key={resource._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Resources');

