import { Anchor, Card, Center, Divider, Image, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { Terrain } from '../../utils/data/terrains';
import { normalizeName, prettyExpansion } from '../../utils/utils';
import ExpansionRenderer, { makeExpansionCases } from '../ExpansionRenderer';

interface Props {
	terrain: Terrain;
}

// description: string;
// yieldModifier: YieldRecord[];
// harvestYield: YieldRecord[];
// movementCostModifier: number;
// defenseModifier: number;
// impassable: boolean;
// removable: boolean;
// harvestable: boolean;
const TerrainStatSummary: React.FC<Props> = ({ terrain }) => {
	return (
		<Card miw="min(15vw, 300px)" shadow="md" radius="lg" withBorder>
			<Center>
				<Title order={3}>{terrain.name}</Title>
			</Center>
			<Center>
				<Image src={terrain.icon} height={100} width={100} />
			</Center>
			<Space h="lg" />
			<Center>
				<Title order={4}>Introduced in {prettyExpansion(terrain.addedBy)}</Title>
			</Center>
			<Space h="lg" />
		</Card>
	);
};

export default TerrainStatSummary;

