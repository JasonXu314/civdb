export type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Renaissance' | 'Industrial' | 'Modern' | 'Atomic' | 'Information' | 'Future';
export const ERAS = ['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Atomic', 'Information', 'Future'];

export enum DLC {
	BASE,
	RF,
	GS
}
export type DLCString = 'base' | 'rf' | 'gs';
export const DLC_STRINGS = ['base', 'rf', 'gs'];

export const RESOURCES = ['Horses', 'Iron', 'Niter', 'Coal', 'Oil', 'Aluminum', 'Uranium'] as const;
export const YIELDS = ['Food', 'Production', 'Gold', 'Science', 'Culture', 'Faith', 'Power', 'Diplomatic Favor', 'Tourism'] as const;

export function dlcValue(dlc: DLCString): DLC {
	switch (dlc) {
		case 'base':
			return DLC.BASE;
		case 'rf':
			return DLC.RF;
		case 'gs':
			return DLC.GS;
		default:
			throw new Error('Bad DLC string');
	}
}

export function toDLCString(dlc: DLC): DLCString {
	switch (dlc) {
		case DLC.BASE:
			return 'base';
		case DLC.RF:
			return 'rf';
		case DLC.GS:
			return 'gs';
		default:
			throw new Error('Bad DLC number');
	}
}

