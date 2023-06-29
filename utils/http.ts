import axios from 'axios';
import { Civic, CompleteCivicData, UnmarshalledCivic } from './data/civics';
import { CompleteFeatureData, Feature, UnmarshalledFeature } from './data/features';
import { CompleteResourceData, Resource, UnmarshalledResource } from './data/resources';
import { CompleteTechnologyData, Technology, UnmarshalledTechnology } from './data/technologies';
import { CompleteTerrainData, Terrain, UnmarshalledTerrain } from './data/terrains';
import { CompleteUnitData, UnmarshalledUnit } from './data/units';
import { civicToFormData, featureToFormData, resourceToFormData, techToFormData, terrainToFormData, unitToFormData } from './transformers';

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

export async function getTerrains() {
	return backendClient.get<Terrain[]>('/terrains');
}

export async function getTerrainByName(name: string) {
	return backendClient.get<Terrain>(`/terrains/${name}`);
}

export async function getTerrainsData() {
	return backendClient.get<UnmarshalledTerrain[]>('/terrains/data');
}

export async function getTerrainById(id: string) {
	return backendClient.get<UnmarshalledTerrain>(`/terrains/data/${id}`);
}

export async function createTerrain(data: CompleteTerrainData) {
	return backendClient.post<UnmarshalledTerrain>(`/terrains/data?secret=${localStorage.getItem('civdb:secret')}`, terrainToFormData(data));
}

export async function updateTerrain(id: string, updates: DeepPartial<CompleteTerrainData>) {
	return backendClient.patch(`/terrains/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, terrainToFormData(updates));
}

export async function getFeatures() {
	return backendClient.get<Feature[]>('/features');
}

export async function getFeatureByName(name: string) {
	return backendClient.get<Feature>(`/features/${name}`);
}

export async function getFeaturesData() {
	return backendClient.get<UnmarshalledFeature[]>('/features/data');
}

export async function getFeatureById(id: string) {
	return backendClient.get<UnmarshalledFeature>(`/features/data/${id}`);
}

export async function createFeature(data: CompleteFeatureData) {
	return backendClient.post<UnmarshalledFeature>(`/features/data?secret=${localStorage.getItem('civdb:secret')}`, featureToFormData(data));
}

export async function updateFeature(id: string, updates: DeepPartial<CompleteFeatureData>) {
	return backendClient.patch(`/features/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, featureToFormData(updates));
}

export async function getResources() {
	return backendClient.get<Resource[]>('/resources');
}

export async function getResourceByName(name: string) {
	return backendClient.get<Resource>(`/resources/${name}`);
}

export async function getResourcesData() {
	return backendClient.get<UnmarshalledResource[]>('/resources/data');
}

export async function getResourceById(id: string) {
	return backendClient.get<UnmarshalledResource>(`/resources/data/${id}`);
}

export async function createResource(data: CompleteResourceData) {
	return backendClient.post<UnmarshalledResource>(`/resources/data?secret=${localStorage.getItem('civdb:secret')}`, resourceToFormData(data));
}

export async function updateResource(id: string, updates: DeepPartial<CompleteResourceData>) {
	return backendClient.patch(`/resources/data/${id}?secret=${localStorage.getItem('civdb:secret')}`, resourceToFormData(updates));
}

