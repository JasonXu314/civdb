import axios from 'axios';
import { Civic, CompleteCivicData, UnmarshalledCivic } from './data/civics';
import { CompleteTechnologyData, Technology, UnmarshalledTechnology } from './data/technologies';
import { CompleteUnitData, UnmarshalledUnit } from './data/units';
import { civicToFormData, techToFormData, unitToFormData } from './transformers';

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
	return backendClient.get<UnmarshalledUnit[]>('/units/data');
}

export async function getUnitById(id: string) {
	return backendClient.get<UnmarshalledUnit>(`/units/data/${id}`);
}

export async function createUnit(data: CompleteUnitData) {
	return backendClient.post<UnmarshalledUnit>(`/units/data?secret=${localStorage.getItem('civdb:secret')}`, unitToFormData(data));
}

export async function updateUnit(id: string, updates: DeepPartial<CompleteUnitData>) {
	return backendClient.patch(`/units/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, unitToFormData(updates));
}

export async function getTechs() {
	return backendClient.get<Technology[]>('/technologies');
}

export async function getTechsData() {
	return backendClient.get<UnmarshalledTechnology[]>('/technologies/data');
}

export async function getTechById(id: string) {
	return backendClient.get<UnmarshalledTechnology>(`/technologies/data/${id}`);
}

export async function getTechByName(name: string) {
	return backendClient.get<Technology>(`/technologies/${name}`);
}

export async function createTech(data: CompleteTechnologyData) {
	return backendClient.post<UnmarshalledTechnology>(`/technologies/data?secret=${localStorage.getItem('civdb:secret')}`, techToFormData(data));
}

export async function updateTech(id: string, updates: DeepPartial<CompleteTechnologyData>) {
	return backendClient.patch(`/technologies/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, techToFormData(updates));
}

export async function getCivics() {
	return backendClient.get<Civic[]>('/civics');
}

export async function getCivicByName(name: string) {
	return backendClient.get<Civic>(`/civics/${name}`);
}

export async function getCivicsData() {
	return backendClient.get<UnmarshalledCivic[]>('/civics/data');
}

export async function getCivicById(id: string) {
	return backendClient.get<UnmarshalledCivic>(`/civics/data/${id}`);
}

export async function createCivic(data: CompleteCivicData) {
	return backendClient.post<UnmarshalledCivic>(`/civics/data?secret=${localStorage.getItem('civdb:secret')}`, civicToFormData(data));
}

export async function updateCivic(id: string, updates: DeepPartial<CompleteCivicData>) {
	return backendClient.patch(`/civics/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, civicToFormData(updates));
}

