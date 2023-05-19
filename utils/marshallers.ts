import { CompleteUnitData } from './data/units';

export function unitToFormData(data: DeepPartial<CompleteUnitData>): FormData {
	const fd = new FormData();

	(
		[
			'name',
			'promotionClass',
			'era',
			'addedBy',
			'unique',
			'movement',
			'sight',
			'strength',
			'range',
			'rangedStrength',
			'bombardStrength',
			'aaStrength',
			'description'
		] as const
	).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(
		[
			'production',
			'gold',
			'maintenance',
			'replaces',
			'unlockedBy',
			'obsoletedBy',
			'upgradesFrom',
			'upgradesTo',
			'resource',
			'maintenanceResource'
		] as const
	).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

