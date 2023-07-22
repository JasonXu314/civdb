import { Anchor, Stack, Text, Title, Image, Group } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { Feature } from '../../utils/data/features';
import { getFeatures } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const Index: NextPage = () => {
	const [features, setFeatures] = useState<Feature[] | null>(null);

	useEffect(() => {
		getFeatures().then((res) => setFeatures(res.data));
	}, []);

	return (
		<>
			<Head>
				<title>CivDB | Features</title>
			</Head>
			<Title mb="lg">Features</Title>
			<Text>Features are pretty uninteresting</Text>
			<Title mt="lg" id="list" order={2}>
				List of Features
			</Title>
			{features === null ? (
				<Text>Loading...</Text>
			) : (
				<Stack>
					{features.map((feature) => (
						<Anchor key={feature._id} component={Link} href="/features/[name]" as={`/features/${normalizeName(feature.name)}`}>
							<Group>
								<Image src={feature.icon} width="50"></Image>
								{feature.name}
							</Group>
						</Anchor>
					))}
				</Stack>
			)}
		</>
	);
};

export default Index;

