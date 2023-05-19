import axios from 'axios';
import { unitToFormData } from './marshallers';

export const backendClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true
});

export async function getAsset(url: string) {
	return axios.get<Blob>(url, { withCredentials: false, responseType: 'blob' });
}

export async function getUnitsData() {
	return backendClient.get<UnmarshalledUnit[]>('/units', { withCredentials: false });
}

export async function getUnitById(id: string) {
	return backendClient.get<UnmarshalledUnit>(`/units/${id}`, { withCredentials: false });
}

export async function createUnit(data: CompleteInputData<UnmarshalledUnit>) {
	return backendClient.post<UnmarshalledUnit>('/units', unitToFormData(data));
}

export async function updateUnit(id: string, updates: DeepPartial<CompleteInputData<UnmarshalledUnit>>) {
	return backendClient.patch(`/units/${id}`, unitToFormData(updates));
}

