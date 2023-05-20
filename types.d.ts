type WithoutId<T> = Omit<T, '_id'>;
type DeepPartial<T> = {
	[K in Extract<keyof T, string>]?: T[K] extends Blob ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

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
	base: number;
	rf: number | null;
	gs: number | null;
}

interface ResourceRequirement {
	resource: Resource;
	quantity: number;
}

interface ResourceDLCRecord {
	base: ResourceRequirement | null;
	rf: ResourceRequirement | null;
	gs: ResourceRequirement | null;
}

