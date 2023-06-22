type WithoutId<T> = Omit<T, '_id'>;
type DeepPartial<T> = {
	[K in Extract<keyof T, string>]?: T[K] extends Blob ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Expansion = 'base' | 'rf' | 'gs';

type Resource = 'Horses' | 'Iron' | 'Niter' | 'Coal' | 'Oil' | 'Aluminum' | 'Uranium';
type Yield = 'Food' | 'Production' | 'Gold' | 'Science' | 'Culture' | 'Faith' | 'Power' | 'Diplomatic Favor' | 'Tourism';

interface ErrorResponse {
	statusCode: number;
	message: string;
	error: string;
}

interface ReferenceDLCRecord<T> {
	base: T | null;
	rf: T | null;
	gs: T | null;
}

interface MultiReferenceDLCRecord<T> {
	base: T[];
	rf: T[];
	gs: T[];
}

interface DescDLCRecord {
	base: string | null;
	rf: string | null;
	gs: string | null;
}

interface MultiDescDLCRecord {
	base: string[];
	rf: string[];
	gs: string[];
}

interface StatDLCRecord {
	base: number | null;
	rf: number | null;
	gs: number | null;
}

interface ResourceRecord {
	resource: Resource;
	quantity: number;
}

interface ResourceDLCRecord {
	base: ResourceRecord | null;
	rf: ResourceRecord | null;
	gs: ResourceRecord | null;
}

interface YieldRecord {
	yield: Yield;
	quantity: number;
}

interface YieldDLCRecord {
	base: YieldRecord | null;
	rf: YieldRecord | null;
	gs: YieldRecord | null;
}

