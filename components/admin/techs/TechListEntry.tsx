import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledTechnology } from '../../../utils/data/technologies';

interface Props {
	tech: UnmarshalledTechnology;
}

const TechListEntry: React.FC<Props> = ({ tech }) => {
	return (
		<Paper shadow="md" withBorder>
			<Flex direction="row">
				<Image src={tech.icon} height={75} width={75} />
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

