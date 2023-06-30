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
	Switch,
	Text,
	TextInput,
	Textarea,
	Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { YIELDS } from '../../../utils/data/common';
import { CompleteFeatureData, FeatureData, UnmarshalledFeature, featureValidators } from '../../../utils/data/features';
import { UnmarshalledTerrain } from '../../../utils/data/terrains';
import { makeDLCInputs } from '../../../utils/dlcInputs';
import { getTerrainsData } from '../../../utils/http';
import FormHorizontalSection from '../FormHorizontalSection';
import { TerrainItem } from '../terrains/TerrainsForm';

interface Props {
	onSubmit: (data: CompleteFeatureData) => void;
	onCancel?: () => void;
	initialValues?: CompleteFeatureData;
}

interface FeatureItemProps extends React.ComponentPropsWithoutRef<'div'> {
	feature: UnmarshalledFeature | null;
}

export const FeatureItem = forwardRef<HTMLDivElement, FeatureItemProps>(function TechnologyItem({ feature, ...others }: FeatureItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={feature ? feature.icon : undefined} />
				<Text size="sm">{feature ? feature.name : ''}</Text>
			</Group>
		</div>
	);
});

const FeaturesForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const [terrains, setTerrains] = useState<UnmarshalledTerrain[]>([]);
	const form = useForm<FeatureData>({
		initialValues: initialValues
			? initialValues
			: {
					name: '',
					addedBy: null,
					icon: null,
					description: '',
					yieldModifier: [],
					movementCostModifier: 0,
					defenseModifier: 0,
					removable: false,
					impassable: false,
					validTerrain: [],
					harvestable: false,
					harvestYield: []
			  },
		validate: featureValidators
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);

	useEffect(() => {
		getTerrainsData().then((res) => setTerrains(res.data));
	}, [initialValues]);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteFeatureData))}>
			<Stack>
				<TextInput label="Name" placeholder="Feature Name" {...form.getInputProps('name')} />
				<FileInput label="Icon" {...form.getInputProps('icon')} />
				{form.values.icon && <Image src={preview} height={75} width={75} />}
				<Radio.Group label="DLC Added" {...form.getInputProps('addedBy')}>
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Radio label={prettyDLC} value={dlc} />
					))}
				</Radio.Group>
				<NumberInput label="Movement Modifier" {...form.getInputProps('movementCostModifier')} />
				<NumberInput label="Defense Modifier" {...form.getInputProps('defenseModifier')} />
				<Switch label="Removable" {...form.getInputProps('removable', { type: 'checkbox' })} />
				<Switch label="Impassable" {...form.getInputProps('impassable', { type: 'checkbox' })} />
				<Switch
					label="Harvestable"
					{...form.getInputProps('harvestable', { type: 'checkbox' })}
					onChange={(evt) => {
						form.getInputProps('harvestable', { type: 'checkbox' }).onChange(evt);
						form.setFieldValue('harvestYield', []);
					}}
				/>
				<Textarea label="Description" placeholder="Feature Description" {...form.getInputProps('description')} />
				<FormHorizontalSection title="Yields">
					<Stack>
						<Title order={4}>Modifiers</Title>
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
					{form.values.harvestable && (
						<Stack>
							<Title order={4}>Harvest</Title>
							{form.values.yieldModifier.map((_, i) => (
								<Center key={i}>
									<Group>
										<NativeSelect data={YIELDS.map((str) => str)} {...form.getInputProps(`harvestYield.${i}.yield`)} />
										<NumberInput {...form.getInputProps(`harvestYield.${i}.quantity`)} />
									</Group>
								</Center>
							))}
							<Group position="center">
								<Button
									onClick={() => {
										form.setFieldValue('harvestYield', form.values.harvestYield.concat({ yield: 'Food', quantity: 0 }));
									}}
									rightIcon={<PlusCircledIcon width={24} height={24} />}>
									Add
								</Button>
							</Group>
						</Stack>
					)}
				</FormHorizontalSection>
				<MultiSelect
					label="Appears On"
					data={terrains.map((terrain) => ({ label: terrain.name, value: terrain._id, terrain }))}
					{...form.getInputProps('validTerrain')}
					itemComponent={TerrainItem}
					searchable
				/>
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

export default FeaturesForm;

