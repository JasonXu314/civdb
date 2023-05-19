export function isPositive(empty: React.ReactNode, negative: React.ReactNode): (value: number | null) => React.ReactNode {
	return (value) => (value === 0 || value === null || (value as any) === '' ? empty : value < 0 ? negative : null);
}

export function isNonNegative(err: React.ReactNode): (value: number | null) => React.ReactNode {
	return (value) => (value !== null && (value as any) !== '' && value < 0 ? err : null);
}

