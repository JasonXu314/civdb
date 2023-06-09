import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledCivic } from '../../../utils/data/civics';

interface Props {
	civic: UnmarshalledCivic;
}

const CivicListEntry: React.FC<Props> = ({ civic }) => {
	return (
		<Paper shadow="md" withBorder p="sm">
			<Flex direction="row" gap="lg">
				<Image src={civic.icon} height={50} width={50} />
				<Center>
					<Anchor href="/admin/civics/[id]" component={Link} as={`/admin/civics/${civic._id}`}>
						{civic.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default CivicListEntry;

