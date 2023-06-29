import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledResource } from '../../../utils/data/resources';

interface Props {
	resource: UnmarshalledResource;
}

const ResourceListEntry: React.FC<Props> = ({ resource }) => {
	return (
		<Paper shadow="md" withBorder p="sm">
			<Flex direction="row" gap="lg">
				<Image src={resource.icon} height={50} width={50} />
				<Center>
					<Anchor href="/admin/resources/[id]" component={Link} as={`/admin/resources/${resource._id}`}>
						{resource.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default ResourceListEntry;

