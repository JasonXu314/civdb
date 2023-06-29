import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { isNonNegative } from '../validators';
import { DLCString, YIELDS } from './common';
import { UnmarshalledTechnology } from './technologies';
import { UnmarshalledTerrain } from './terrains';

interface ResourceBase<IconType> {
	name: string;
	icon: IconType;
	description: string;
	yieldModifier: YieldRecord[];
	harvestYield: YieldRecord;
	otherNotes: string[];
}

interface ConcreteResource<T> extends ResourceBase<T> {
	_id: string;
	addedBy: DLCString;
}

interface ResourceDataBase<T> extends ResourceBase<T> {
	validTerrain: string[];
	validFeatures: string[];
	harvestTech: string;
}

export interface Resource extends ConcreteResource<string> {
	validTerrain: UnmarshalledTerrain[];
	validFeatures: UnmarshalledResource[];
	harvestTech: UnmarshalledTechnology;
}

export interface UnmarshalledResource extends ConcreteResource<string> {
	validTerrain: string[];
	validFeatures: string[];
	harvestTech: string;
}

export interface ResourceData extends ResourceDataBase<File | null> {
	addedBy: DLCString | null;
}

export interface CompleteResourceData extends ResourceDataBase<File> {
	addedBy: DLCString;
}

export const resourceValidators: FormValidateInput<ResourceData> = {
	name: isNotEmpty('Name must not be empty'),
	addedBy: isNotEmpty('Must select DLC the unit was added in'),
	icon: isNotEmpty('Must provide unit icon'),
	yieldModifier: {
		quantity: isNonNegative('Yields must be greater than 0'),
		yield: (val) => (YIELDS.includes(val) ? null : `Yield must be one of: ${YIELDS.join(', ')}`)
	}
};

