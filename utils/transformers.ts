import { CompleteCivicData } from './data/civics';
import { CompleteFeatureData } from './data/features';
import { CompleteResourceData } from './data/resources';
import { CompleteTechnologyData } from './data/technologies';
import { CompleteTerrainData } from './data/terrains';
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

export function techToFormData(data: DeepPartial<CompleteTechnologyData>): FormData {
	const fd = new FormData();

	(['name', 'description', 'era', 'addedBy'] as const).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(['otherEffects', 'eureka', 'dependencies', 'cost'] as const).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

export function civicToFormData(data: DeepPartial<CompleteCivicData>): FormData {
	const fd = new FormData();

	(['name', 'description', 'era', 'addedBy'] as const).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(['otherEffects', 'inspiration', 'dependencies', 'cost', 'envoys', 'governorTitles'] as const).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

export function terrainToFormData(data: DeepPartial<CompleteTerrainData>): FormData {
	const fd = new FormData();

	(['name', 'description', 'addedBy', 'movementCost', 'defenseModifier', 'impassable'] as const).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(['yields', 'weatherEffects'] as const).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

export function featureToFormData(data: DeepPartial<CompleteFeatureData>): FormData {
	const fd = new FormData();

	(['name', 'description', 'addedBy', 'movementCostModifier', 'defenseModifier', 'removable', 'impassable', 'harvestable'] as const).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(['yieldModifier', 'validTerrain', 'harvestYield'] as const).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

export function resourceToFormData(data: DeepPartial<CompleteResourceData>): FormData {
	const fd = new FormData();

	(['name', 'description', 'addedBy', 'harvestTech'] as const).forEach((prop) => {
		const val = data[prop];
		if (val !== undefined) {
			fd.append(prop, val !== null ? val.toString() : 'null');
		}
	});

	(['yieldModifier', 'harvestYield', 'validTerrain', 'validFeatures', 'otherNotes'] as const).forEach((prop) => {
		if (data[prop] !== undefined) {
			fd.append(prop, JSON.stringify(data[prop]));
		}
	});

	if (data.icon) {
		fd.append('icon', data.icon, data.icon.name);
	}

	return fd;
}

