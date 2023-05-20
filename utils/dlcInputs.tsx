import { Group } from '@mantine/core';

interface DLCInputFnProps {
	dlc: 'base' | 'rf' | 'gs';
	prettyDLC: 'Base' | 'Rise & Fall' | 'Gathering Storm';
}

export function makeDLCInputs(fn: (props: DLCInputFnProps) => React.ReactNode): React.ReactNode {
	return (
		<Group spacing="sm" grow>
			{fn({ dlc: 'base', prettyDLC: 'Base' })}
			{fn({ dlc: 'rf', prettyDLC: 'Rise & Fall' })}
			{fn({ dlc: 'gs', prettyDLC: 'Gathering Storm' })}
		</Group>
	);
}

