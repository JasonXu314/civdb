interface ExpansionInputFnProps {
	expansion: 'base' | 'rf' | 'gs';
	prettyExpansion: 'Base' | 'Rise & Fall' | 'Gathering Storm';
}

export function makeExpansionInputs(fn: (props: ExpansionInputFnProps) => React.ReactNode): React.ReactNode {
	return (
		<>
			{fn({ expansion: 'base', prettyExpansion: 'Base' })}
			{fn({ expansion: 'rf', prettyExpansion: 'Rise & Fall' })}
			{fn({ expansion: 'gs', prettyExpansion: 'Gathering Storm' })}
		</>
	);
}

