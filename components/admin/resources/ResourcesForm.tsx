import {
	Avatar,
	Button,
	Center,
	FileInput,
	Group,
	Image,
	MultiSelect,
	NativeSelect,
	NumberInput,
	Radio,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { YIELDS } from '../../../utils/data/common';
import { UnmarshalledFeature } from '../../../utils/data/features';
import { CompleteResourceData, ResourceData, UnmarshalledResource, resourceValidators } from '../../../utils/data/resources';
import { UnmarshalledTechnology } from '../../../utils/data/technologies';
import { UnmarshalledTerrain } from '../../../utils/data/terrains';
import { makeDLCInputs } from '../../../utils/dlcInputs';
import { getFeaturesData, getTechsData, getTerrainsData } from '../../../utils/http';
import FormHorizontalSection from '../FormHorizontalSection';
import { TechItem } from '../techs/TechsForm';
import { TerrainItem } from '../terrains/TerrainsForm';

interface Props {
	onSubmit: (data: CompleteResourceData) => void;
	onCancel?: () => void;
	initialValues?: CompleteResourceData;
}

interface ResourceItemProps extends React.ComponentPropsWithoutRef<'div'> {
	civResource: UnmarshalledResource | null;
}

export const FeatureItem = forwardRef<HTMLDivElement, ResourceItemProps>(function ResourceItem({ civResource, ...others }: ResourceItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={civResource ? civResource.icon : undefined} />
				<Text size="sm">{civResource ? civResource.name : ''}</Text>
			</Group>
		</div>
	);
});

const ResourcesForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const [terrains, setTerrains] = useState<UnmarshalledTerrain[]>([]);
	const [features, setFeatures] = useState<UnmarshalledFeature[]>([]);
	const [techs, setTechs] = useState<UnmarshalledTechnology[]>([]);
	const form = useForm<ResourceData>({
		initialValues: initialValues
			? initialValues
			: {
					name: '',
					addedBy: null,
					icon: null,
					description: '',
					yieldModifier: [],
					validTerrain: [],
					validFeatures: [],
					harvestYield: { yield: 'Food', quantity: 0 },
					otherNotes: [],
					harvestTech: ''
			  },
		validate: resourceValidators
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);

	useEffect(() => {
		getTerrainsData().then((res) => setTerrains(res.data));
		getFeaturesData().then((res) => setFeatures(res.data));
		getTechsData().then((res) => setTechs(res.data));
	}, [initialValues]);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteResourceData))}>
			<Stack>
				<TextInput label="Name" placeholder="Resource Name" {...form.getInputProps('name')} />
				<FileInput label="Icon" {...form.getInputProps('icon')} />
				{form.values.icon && <Image src={preview} height={75} width={75} />}
				<Radio.Group label="DLC Added" {...form.getInputProps('addedBy')}>
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Radio label={prettyDLC} value={dlc} />
					))}
				</Radio.Group>
				<Textarea label="Description" placeholder="Feature Description" {...form.getInputProps('description')} />
				<Stack>
					<Title order={4}>Yield Modifier(s)</Title>
					{form.values.yieldModifier.map((_, i) => (
						<Center key={i}>
							<Group>
								<NativeSelect data={YIELDS.map((str) => str)} {...form.getInputProps(`yieldModifier.${i}.yield`)} />
								<NumberInput {...form.getInputProps(`yieldModifier.${i}.quantity`)} />
							</Group>
						</Center>
					))}
					<Group position="center">
						<Button
							onClick={() => {
								form.setFieldValue('yieldModifier', form.values.yieldModifier.concat({ yield: 'Food', quantity: 0 }));
							}}
							rightIcon={<PlusCircledIcon width={24} height={24} />}>
							Add
						</Button>
					</Group>
				</Stack>
				<FormHorizontalSection title="Harvesting">
					<Stack>
						<Group>
							<NativeSelect data={YIELDS.map((str) => str)} {...form.getInputProps(`harvestYield.yield`)} />
							<NumberInput {...form.getInputProps(`harvestYield.quantity`)} />
						</Group>
					</Stack>
					<Stack>
						<MultiSelect
							label="Harvest Technology"
							data={techs.map((tech) => ({ label: tech.name, value: tech._id, tech }))}
							{...form.getInputProps(`harvestTech`)}
							itemComponent={TechItem}
							searchable
						/>
					</Stack>
				</FormHorizontalSection>
				<FormHorizontalSection title="Appears On">
					<MultiSelect
						label="Terrain"
						data={terrains.map((terrain) => ({ label: terrain.name, value: terrain._id, terrain }))}
						{...form.getInputProps('validTerrain')}
						itemComponent={TerrainItem}
						searchable
					/>
					<MultiSelect
						label="Feature"
						data={features.map((feature) => ({ label: feature.name, value: feature._id, feature }))}
						{...form.getInputProps('validFeatures')}
						itemComponent={TerrainItem}
						searchable
					/>
				</FormHorizontalSection>
				<Group grow>
					<Button type="submit" color={initialValues ? 'teal' : undefined} leftIcon={initialValues ? <CheckIcon /> : <PlusCircledIcon />}>
						{initialValues ? 'Update' : 'Create'}
					</Button>
					<Button color="red" leftIcon={<CrossCircledIcon />} onClick={() => onCancel && onCancel()}>
						Cancel
					</Button>
				</Group>
			</Stack>
		</form>
	);
};

export default ResourcesForm;

