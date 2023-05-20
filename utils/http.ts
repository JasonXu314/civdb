import axios from 'axios';
import { CompleteTechnologyData, UnmarshalledTechnology } from './data/technologies';
import { CompleteUnitData, UnmarshalledUnit } from './data/units';
import { techToFormData, unitToFormData } from './transformers';

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

export async function getTechsData() {
	return backendClient.get<UnmarshalledTechnology[]>('/technologies/data', { withCredentials: false });
}

export async function getTechById(id: string) {
	return backendClient.get<UnmarshalledTechnology>(`/technologies/data/${id}`, { withCredentials: false });
}

export async function createTech(data: CompleteTechnologyData) {
	return backendClient.post<UnmarshalledTechnology>(`/technologies/data?secret=${localStorage.getItem('civdb:secret')}`, techToFormData(data));
}

export async function updateTech(id: string, updates: DeepPartial<CompleteTechnologyData>) {
	return backendClient.patch(`/technologies/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, techToFormData(updates));
}

