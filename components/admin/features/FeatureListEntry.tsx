import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledFeature } from '../../../utils/data/features';

interface Props {
	feature: UnmarshalledFeature;
}

const FeatureListEntry: React.FC<Props> = ({ feature }) => {
	return (
		<Paper shadow="md" withBorder p="sm">
			<Flex direction="row" gap="lg">
				<Image src={feature.icon} height={50} width={50} />
				<Center>
					<Anchor href="/admin/features/[id]" component={Link} as={`/admin/features/${feature._id}`}>
						{feature.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default FeatureListEntry;

