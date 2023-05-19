import { Anchor, Center, Flex, Image, Paper } from '@mantine/core';
import Link from 'next/link';
import { UnmarshalledUnit } from '../../../utils/data/units';

interface Props {
	unit: UnmarshalledUnit;
}

const UnitListEntry: React.FC<Props> = ({ unit }) => {
	return (
		<Paper shadow="md" withBorder>
			<Flex direction="row">
				<Image src={unit.icon} height={75} width={75} />
				<Center>
					<Anchor href="/admin/units/[id]" component={Link} as={`/admin/units/${unit._id}`}>
						{unit.name}
					</Anchor>
				</Center>
			</Flex>
		</Paper>
	);
};

export default UnitListEntry;

