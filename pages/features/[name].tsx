import { Group, Text, Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import FeatureStatSummary from '../../components/features/FeatureStatSummary';
import { Feature } from '../../utils/data/features';
import { getFeatureByName } from '../../utils/http';
import { normalizeName } from '../../utils/utils';

const FeatureName: NextPage = () => {
	const router = useRouter();
	const [feature, setFeature] = useState<Feature | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const featureName = router.query.name as string;

		if (featureName !== undefined) {
			if (normalizeName(featureName) !== featureName) {
				router.replace('/features/[name]', `/features/${normalizeName(featureName)}`);
				return;
			}

			getFeatureByName(featureName)
				.then((res) => setFeature(res.data))
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

	if (!feature) {
		return (
			<>
				<Head>
					<title>CivDB | Feature not found</title>
				</Head>
				<Title>Sorry, there&apos;s no feature with that name.</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Feature</title>
			</Head>
			<Title>{feature.name}</Title>
			<Group align="baseline" sx={{ justifyContent: 'space-between' }} pr="lg">
				<FeatureStatSummary feature={feature} />
				<Text maw="60vw">{feature.description}</Text>
			</Group>
		</>
	);
};

export default FeatureName;

