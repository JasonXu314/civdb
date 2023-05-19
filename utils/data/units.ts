import { isNotEmpty } from '@mantine/form';
import { FormValidateInput } from '@mantine/form/lib/types';
import { isNonNegative, isPositive } from '../validators';

export type PromotionClass =
	| 'Recon'
	| 'Melee'
	| 'Ranged'
	| 'Anti-Cavalry'
	| 'Light Cavalry'
	| 'Heavy Cavalry'
	| 'Siege'
	| 'Naval Melee'
	| 'Naval Ranged'
	| 'Naval Raider'
	| 'Naval Carrier'
	| 'Fighter'
	| 'Bomber'
	| 'Warrior Monks'
	| 'Nihang'
	| 'Apostles'
	| 'Spies'
	| 'Rock Bands'
	| 'Giant Death Robots'
	| 'Soothsayers';

export type Resource = 'Horses' | 'Iron' | 'Niter' | 'Coal' | 'Oil' | 'Aluminum' | 'Uranium';

export const PROMOTION_CLASSES = [
		'Recon',
		'Melee',
		'Ranged',
		'Anti-Cavalry',
		'Light Cavalry',
		'Heavy Cavalry',
		'Siege',
		'Naval Melee',
		'Naval Ranged',
		'Naval Raider',
		'Naval Carrier',
		'Fighter',
		'Bomber',
		'Warrior Monks',
		'Nihang',
		'Apostles',
		'Spies',
		'Rock Bands',
		'Giant Death Robots',
		'Soothsayers'
	] as const,
	RESOURCES = ['Horses', 'Iron', 'Niter', 'Coal', 'Oil', 'Aluminum', 'Uranium'] as const;

interface UnitBase<IconType> {
	name: string;
	production: StatDLCRecord;
	gold: StatDLCRecord;
	maintenance: StatDLCRecord;
	resource: ResourceDLCRecord;
	maintenanceResource: ResourceDLCRecord;
	icon: IconType;
	unique: boolean;
	movement: number;
	sight: number;
	strength: number;
	range: number;
	rangedStrength: number | null;
	bombardStrength: number | null;
	aaStrength: number | null;
	description: string;
}

interface ConcreteUnit<T> extends UnitBase<T> {
	_id: string;
	promotionClass: PromotionClass;
	era: Era;
}

interface UnitDataBase<T> extends UnitBase<T> {
	replaces: ReferenceDLCRecord<string>;
	unlockedBy: ReferenceDLCRecord<string>;
	obsoletedBy: ReferenceDLCRecord<string>;
	upgradesFrom: MultiReferenceDLCRecord<string>;
	upgradesTo: MultiReferenceDLCRecord<string>;
}

export interface Unit extends ConcreteUnit<string> {
	replaces: ReferenceDLCRecord<UnmarshalledUnit>;
	unlockedBy: ReferenceDLCRecord<any>; // TODO: replace with tech/civic when done
	obsoletedBy: ReferenceDLCRecord<any>;
	upgradesFrom: MultiReferenceDLCRecord<UnmarshalledUnit>;
	upgradesTo: MultiReferenceDLCRecord<UnmarshalledUnit>;
}

export interface UnmarshalledUnit extends ConcreteUnit<string> {
	replaces: ReferenceDLCRecord<string>;
	unlockedBy: ReferenceDLCRecord<string>;
	obsoletedBy: ReferenceDLCRecord<string>;
	upgradesFrom: MultiReferenceDLCRecord<string>;
	upgradesTo: MultiReferenceDLCRecord<string>;
}

export interface UnitData extends UnitDataBase<File | null> {
	promotionClass: PromotionClass | null;
	era: Era | null;
}

export interface CompleteUnitData extends UnitDataBase<File> {
	promotionClass: PromotionClass;
	era: Era;
}

export const unitValidators: FormValidateInput<UnitData> = {
	name: isNotEmpty('Name must not be empty'),
	promotionClass: isNotEmpty('Must select a promotion class'),
	era: isNotEmpty('Must select an era'),
	production: {
		base: isPositive('Must provide a base production cost', 'Production cost must be greater than 0')
	},
	gold: {
		base: isPositive('Must provide a base gold cost', 'Gold cost must be greater than 0')
	},
	maintenance: {
		base: isNonNegative('Maintenance cost must be greater than or equal to 0')
	},
	resource: {
		base: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value, { resource: { base } }) =>
				base !== null ? isPositive('Must provide resource cost', 'Resource cost must not be negative')(value) : null
		},
		rf: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value, { resource: { rf } }) =>
				rf !== null ? isPositive('Must provide resource cost', 'Resource cost must not be negative')(value) : null
		},
		gs: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value, { resource: { gs } }) =>
				gs !== null ? isPositive('Must provide resource cost', 'Resource cost must not be negative')(value) : null
		}
	},
	maintenanceResource: {
		base: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value) => (value !== null ? isPositive('Must provide resource maintenance cost', 'Resource cost must not be negative')(value) : null)
		},
		rf: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value) => (value !== null ? isPositive('Must provide resource maintenance cost', 'Resource cost must not be negative')(value) : null)
		},
		gs: {
			resource: isNotEmpty('Must provide resource'),
			quantity: (value) => (value !== null ? isPositive('Must provide resource maintenance cost', 'Resource cost must not be negative')(value) : null)
		}
	},
	icon: isNotEmpty('Must provide unit icon'),
	movement: isPositive('Must provide movement', 'Movement must be greater than 0'),
	sight: isPositive('Must provide sight', 'Sight must be greater than 0'),
	strength: isPositive('Must provide combat strength', 'Combat strength must be greater than 0'),
	range: (value, { rangedStrength, bombardStrength }) =>
		value <= 0 && (rangedStrength || bombardStrength) ? 'If the unit is ranged, the range must be greater than 0' : null,
	rangedStrength: (value, { range }) =>
		range !== 0 ? isPositive('If the unit is ranged, it must have a ranged strength', 'Ranged strength must not be negative')(value) : null,
	bombardStrength: (value, { range }) => (range !== 0 ? isNonNegative('Bombard strength must not be negative')(value) : null),
	aaStrength: isNonNegative('AA strength must not be negative'),
	replaces: {
		base: (value, { unique }) => (unique ? isNotEmpty('If the unit is unique, it must replace another unit')(value) : null)
	}
};

