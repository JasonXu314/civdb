export const FILE_NAME_REGEX = /^attachment; filename="([^"]+)"$/;
export const EXPANSION_ORDER = ['base', 'rf', 'gs'] as const;

export async function deepDiff<T>(a: T, b: T): Promise<DeepPartial<T>> {
	if (!b) return b;
	if (!a) return b ? { ...b } : b;

	const diff: DeepPartial<NonNullable<T>> = {};

	for (const prop in a) {
		const value = a[prop],
			otherValue = b[prop];

		if (typeof value === 'object') {
			if (value instanceof File || value instanceof Blob) {
				const data = new Uint8Array(await value.arrayBuffer()),
					otherData = new Uint8Array(await (otherValue as File).arrayBuffer());

				if (data.length === otherData.length) {
					for (let i = 0; i < data.length; i++) {
						if (data[i] !== otherData[i]) {
							diff[prop] = otherValue;
							break;
						}
					}
				} else {
					diff[prop] = otherValue;
				}
			} else if (
				Array.isArray(value) &&
				(value.length !== (otherValue as unknown[]).length || !value.every((val, i) => (otherValue as unknown[])[i] === val))
			) {
				diff[prop] = otherValue;
			} else if (value === null && value !== otherValue) {
				diff[prop] = otherValue;
			} else if (value !== null) {
				const subDiff = (await deepDiff(value, otherValue)) as any;
				if (subDiff === null || Object.keys(subDiff).length > 0) {
					diff[prop] = subDiff;
				}
			}
		} else {
			if (value !== otherValue && otherValue !== undefined) {
				diff[prop] = otherValue;
			}
		}
	}

	return diff;
}

export function isUncapitalizedWord(word: string): boolean {
	return ['of', 'the', 'a'].includes(word);
}

export function normalizeName(name: string): string {
	return name
		.toLowerCase()
		.split(/[\s_]/)
		.map((word, i) => (i === 0 || !isUncapitalizedWord(word) ? word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() : word))
		.join('_');
}

export function compareExpansions(expA: Expansion, expB: Expansion): number {
	return EXPANSION_ORDER.indexOf(expA) - EXPANSION_ORDER.indexOf(expB);
}

/**
 * Returns true if expA preceedes expB
 */
export function expansionPreceedes(expA: Expansion, expB: Expansion): boolean {
	return compareExpansions(expA, expB) < 0;
}

export function prettyExpansion(expansion: Expansion): string {
	switch (expansion) {
		case 'base':
			return 'Base Game';
		case 'rf':
			return 'Rise & Fall';
		case 'gs':
			return 'Gathering Storm';
	}
}
