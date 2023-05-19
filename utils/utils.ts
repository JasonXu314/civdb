export const FILE_NAME_REGEX = /^attachment; filename="([^"]+)"$/;

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
			} else if (Array.isArray(value) && !value.every((val, i) => (otherValue as unknown[])[i] === val)) {
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

