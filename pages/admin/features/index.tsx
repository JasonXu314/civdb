import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import FeatureListEntry from '../../../components/admin/features/FeatureListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledFeature } from '../../../utils/data/features';
import { getFeaturesData } from '../../../utils/http';

const Index: NextPage = () => {
	const [features, setFeatures] = useState<UnmarshalledFeature[] | null>(null);

	useEffect(() => {
		getFeaturesData()
			.then((res) => {
				setFeatures(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!features) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Features</title>
				</Head>
				<Title>Loading Features...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Features</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/features/new">
						Create
					</Button>
				</Group>
				{features.map((feature) => (
					<FeatureListEntry feature={feature} key={feature._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Features');

