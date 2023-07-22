import { Anchor, Card, Center, Divider, Image, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { Feature } from '../../utils/data/features';
import { normalizeName, prettyExpansion } from '../../utils/utils';
import ExpansionRenderer, { makeExpansionCases } from '../ExpansionRenderer';

interface Props {
	feature: Feature;
}

// description: string;
// yieldModifier: YieldRecord[];
// harvestYield: YieldRecord[];
// movementCostModifier: number;
// defenseModifier: number;
// impassable: boolean;
// removable: boolean;
// harvestable: boolean;
const FeatureStatSummary: React.FC<Props> = ({ feature }) => {
	return (
		<Card miw="min(15vw, 300px)" shadow="md" radius="lg" withBorder>
			<Center>
				<Title order={3}>{feature.name}</Title>
			</Center>
			<Center>
				<Image src={feature.icon} height={100} width={100} />
			</Center>
			<Space h="lg" />
			<Center>
				<Title order={4}>Introduced in {prettyExpansion(feature.addedBy)}</Title>
			</Center>
			<Space h="lg" />
		</Card>
	);
};

export default FeatureStatSummary;

