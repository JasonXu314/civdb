import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledTerrain } from '../../../utils/data/terrains';

interface Props {
	terrain: UnmarshalledTerrain;
}

const TerrainListEntry: React.FC<Props> = ({ terrain }) => {
	return (
		<Paper shadow="md" withBorder p="sm">
			<Flex direction="row" gap="lg">
				<Image src={terrain.icon} height={50} width={50} />
				<Center>
					<Anchor href="/admin/terrains/[id]" component={Link} as={`/admin/terrains/${terrain._id}`}>
						{terrain.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default TerrainListEntry;

