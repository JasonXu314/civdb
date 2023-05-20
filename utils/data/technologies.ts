import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { DLCString, Era } from './common';

interface TechnologyBase<IconType> {
	name: string;
	icon: IconType;
	description: string;
	otherEffects: MultiDescDLCRecord;
	eureka: DescDLCRecord;
}

interface ConcreteTechnology<T> extends TechnologyBase<T> {
	_id: string;
	era: Era;
	addedBy: DLCString;
}

interface TechnologyDataBase<T> extends TechnologyBase<T> {
	dependencies: MultiReferenceDLCRecord<string>;
}

export interface Technology extends ConcreteTechnology<string> {
	dependencies: MultiReferenceDLCRecord<UnmarshalledTechnology>;
}

export interface UnmarshalledTechnology extends ConcreteTechnology<string> {
	dependencies: MultiReferenceDLCRecord<string>;
}

export interface TechnologyData extends TechnologyDataBase<File | null> {
	era: Era | null;
	addedBy: DLCString | null;
}

export interface CompleteTechnologyData extends TechnologyDataBase<File> {
	era: Era;
	addedBy: DLCString;
}

export const techValidators: FormValidateInput<TechnologyData> = {
	name: isNotEmpty('Name must not be empty'),
	era: isNotEmpty('Must select an era'),
	addedBy: isNotEmpty('Must select DLC the unit was added in'),
	icon: isNotEmpty('Must provide unit icon')
};

