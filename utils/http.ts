import axios from 'axios';
import { CompleteUnitData, UnmarshalledUnit } from './data/units';
import { unitToFormData } from './marshallers';

export const backendClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
});

export async function getAsset(url: string) {
	return axios.get<Blob>(url, { withCredentials: false, responseType: 'blob' });
}

export async function auth() {
	return backendClient.post(`/auth?secret=${localStorage.getItem('civdb:secret')}`);
}

export async function getUnitsData() {
	return backendClient.get<UnmarshalledUnit[]>('/units/data', { withCredentials: false });
}

export async function getUnitById(id: string) {
	return backendClient.get<UnmarshalledUnit>(`/units/data/${id}`, { withCredentials: false });
}

export async function createUnit(data: CompleteUnitData) {
	return backendClient.post<UnmarshalledUnit>(`/units/data?secret=${localStorage.getItem('civdb:secret')}`, unitToFormData(data));
}

export async function updateUnit(id: string, updates: DeepPartial<CompleteUnitData>) {
	return backendClient.patch(`/units/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, unitToFormData(updates));
}

