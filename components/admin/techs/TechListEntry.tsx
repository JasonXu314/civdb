import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledTechnology } from '../../../utils/data/technologies';

interface Props {
	tech: UnmarshalledTechnology;
}

const TechListEntry: React.FC<Props> = ({ tech }) => {
	return (
		<Paper shadow="md" withBorder p="sm">
			<Flex direction="row" gap="lg">
				<Image src={tech.icon} height={50} width={50} />
				<Center>
					<Anchor href="/admin/technologies/[id]" component={Link} as={`/admin/technologies/${tech._id}`}>
						{tech.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default TechListEntry;

