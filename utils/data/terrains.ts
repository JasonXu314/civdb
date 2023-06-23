import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { isNonNegative } from '../validators';
import { DLCString, YIELDS } from './common';

interface TerrainBase<IconType> {
	name: string;
	icon: IconType;
	description: string;
	yields: YieldRecord[];
	movementCost: number;
	defenseModifier: number;
	impassable: boolean;
	weatherEffects: string[];
}

interface ConcreteTerrain<T> extends TerrainBase<T> {
	_id: string;
	addedBy: DLCString;
}

// TODO: when the resources/features marshalling is added, can remove these eslint disables
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TerrainDataBase<T> extends TerrainBase<T> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Terrain extends ConcreteTerrain<string> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnmarshalledTerrain extends ConcreteTerrain<string> {}

export interface TerrainData extends TerrainDataBase<File | null> {
	addedBy: DLCString | null;
}

export interface CompleteTerrainData extends TerrainDataBase<File> {
	addedBy: DLCString;
}

export const terrainValidators: FormValidateInput<TerrainData> = {
	name: isNotEmpty('Name must not be empty'),
	addedBy: isNotEmpty('Must select DLC the unit was added in'),
	icon: isNotEmpty('Must provide unit icon'),
	yields: {
		quantity: isNonNegative('Yields must be greater than 0'),
		yield: (val) => (YIELDS.includes(val) ? null : `Yield must be one of: ${YIELDS.join(', ')}`)
	}
};

