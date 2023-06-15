import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { isNonNegative } from '../validators';
import { DLCString, Era } from './common';

interface CivicBase<IconType> {
	name: string;
	icon: IconType;
	description: string;
	cost: StatDLCRecord;
	envoys: StatDLCRecord;
	governorTitles: StatDLCRecord;
	otherEffects: MultiDescDLCRecord;
	inspiration: DescDLCRecord;
}

interface ConcreteCivic<T> extends CivicBase<T> {
	_id: string;
	era: Era;
	addedBy: DLCString;
}

interface CivicDataBase<T> extends CivicBase<T> {
	dependencies: MultiReferenceDLCRecord<string>;
}

export interface Civic extends ConcreteCivic<string> {
	dependencies: MultiReferenceDLCRecord<UnmarshalledCivic>;
	dependents: MultiReferenceDLCRecord<UnmarshalledCivic>;
}

export interface UnmarshalledCivic extends ConcreteCivic<string> {
	dependencies: MultiReferenceDLCRecord<string>;
}

export interface CivicData extends CivicDataBase<File | null> {
	era: Era | null;
	addedBy: DLCString | null;
}

export interface CompleteCivicData extends CivicDataBase<File> {
	era: Era;
	addedBy: DLCString;
}

export const civicValidators: FormValidateInput<CivicData> = {
	name: isNotEmpty('Name must not be empty'),
	era: isNotEmpty('Must select an era'),
	addedBy: isNotEmpty('Must select DLC the unit was added in'),
	icon: isNotEmpty('Must provide unit icon'),
	cost: {
		base: isNonNegative('Research cost must be greater than 0'),
		rf: isNonNegative('Research cost must be greater than 0'),
		gs: isNonNegative('Research cost must be greater than 0')
	},
	envoys: {
		base: isNonNegative('Envoys must not be negative'),
		rf: isNonNegative('Envoys must not be negative'),
		gs: isNonNegative('Envoys must not be negative')
	}
};

