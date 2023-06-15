import { useExpansion } from './EspansionContext';

interface Props {
	base: React.ReactNode;
	rf: React.ReactNode;
	gs: React.ReactNode;
	fallback: React.ReactNode;
}

const ExpansionRenderer: React.FC<Props> = ({ base, rf, gs, fallback }) => {
	const expansion = useExpansion();

	switch (expansion) {
		case 'gs':
			if (gs !== null) return <>{gs}</>;
		// falls through
		case 'rf':
			if (rf !== null) return <>{rf}</>;
		// falls through
		case 'base':
			if (base !== null) return <>{base}</>;
	}

	return <>{fallback}</>;
};

export function makeExpansionCases(render: (expansion: Expansion) => React.ReactNode, fallback: React.ReactNode): Props {
	return {
		base: render('base'),
		rf: render('rf'),
		gs: render('gs'),
		fallback
	};
}

export default ExpansionRenderer;

