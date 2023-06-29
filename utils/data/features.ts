import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { isNonNegative } from '../validators';
import { DLCString, YIELDS } from './common';
import { UnmarshalledTerrain } from './terrains';

interface FeatureBase<IconType> {
	name: string;
	icon: IconType;
	description: string;
	yieldModifier: YieldRecord[];
	movementCostModifier: number;
	defenseModifier: number;
	impassable: boolean;
	removable: boolean;
}

interface ConcreteFeature<T> extends FeatureBase<T> {
	_id: string;
	addedBy: DLCString;
}

interface FeatureDataBase<T> extends FeatureBase<T> {
	validTerrain: string[];
}

export interface Feature extends ConcreteFeature<string> {
	validTerrain: UnmarshalledTerrain[];
}

export interface UnmarshalledFeature extends ConcreteFeature<string> {
	validTerrain: string[];
}

export interface FeatureData extends FeatureDataBase<File | null> {
	addedBy: DLCString | null;
}

export interface CompleteFeatureData extends FeatureDataBase<File> {
	addedBy: DLCString;
}

export const featureValidators: FormValidateInput<FeatureData> = {
	name: isNotEmpty('Name must not be empty'),
	addedBy: isNotEmpty('Must select DLC the unit was added in'),
	icon: isNotEmpty('Must provide unit icon'),
	yieldModifier: {
		quantity: isNonNegative('Yields must be greater than 0'),
		yield: (val) => (YIELDS.includes(val) ? null : `Yield must be one of: ${YIELDS.join(', ')}`)
	}
};

