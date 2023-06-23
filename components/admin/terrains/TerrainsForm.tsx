import {
	Avatar,
	Button,
	Center,
	FileInput,
	Group,
	Image,
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
import React, { forwardRef, useMemo } from 'react';
import { YIELDS } from '../../../utils/data/common';
import { CompleteTerrainData, TerrainData, UnmarshalledTerrain, terrainValidators } from '../../../utils/data/terrains';
import { makeDLCInputs } from '../../../utils/dlcInputs';

interface Props {
	onSubmit: (data: CompleteTerrainData) => void;
	onCancel?: () => void;
	initialValues?: CompleteTerrainData;
}

interface TerrainItemProps extends React.ComponentPropsWithoutRef<'div'> {
	terrain: UnmarshalledTerrain | null;
}

export const TerrainItem = forwardRef<HTMLDivElement, TerrainItemProps>(function TechnologyItem({ terrain, ...others }: TerrainItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={terrain ? terrain.icon : undefined} />
				<Text size="sm">{terrain ? terrain.name : ''}</Text>
			</Group>
		</div>
	);
});

const TerrainsForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const form = useForm<TerrainData>({
		initialValues: initialValues
			? initialValues
			: {
					name: '',
					addedBy: null,
					icon: null,
					description: '',
					yields: [],
					movementCost: 0,
					defenseModifier: 0,
					impassable: false,
					weatherEffects: []
			  },
		validate: terrainValidators
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteTerrainData))}>
			<Stack>
				<TextInput label="Name" placeholder="Terrain Name" {...form.getInputProps('name')} />
				<FileInput label="Icon" {...form.getInputProps('icon')} />
				{form.values.icon && <Image src={preview} height={75} width={75} />}
				<Radio.Group label="DLC Added" {...form.getInputProps('addedBy')}>
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Radio label={prettyDLC} value={dlc} />
					))}
				</Radio.Group>
				<NumberInput label="Movement Cost" {...form.getInputProps('movementCost')} />
				<NumberInput label="Defense Modifier" {...form.getInputProps('defenseModifier')} />
				<Switch label="Impassable" {...form.getInputProps('impassable', { type: 'checkbox' })} />
				<Textarea label="Description" placeholder="Terrain Description" {...form.getInputProps('description')} />
				<Stack>
					<Title order={4}>Yields</Title>
					{form.values.yields.map((_, i) => (
						<Center key={i}>
							<Group>
								<NativeSelect data={YIELDS.map((str) => str)} {...form.getInputProps(`yields.${i}.yield`)} />
								<NumberInput {...form.getInputProps(`yields.${i}.quantity`)} />
							</Group>
						</Center>
					))}
					<Group position="center">
						<Button
							onClick={() => {
								form.setFieldValue('yields', form.values.yields.concat({ yield: 'Food', quantity: 0 }));
							}}
							rightIcon={<PlusCircledIcon width={24} height={24} />}>
							Add
						</Button>
					</Group>
				</Stack>
				<Stack>
					<Title order={4}>Weather Effects</Title>
					{form.values.weatherEffects.map((_, i) => (
						<TextInput key={i} {...form.getInputProps(`weatherEffects.${i}`)} />
					))}
					<Group position="center">
						<Button
							onClick={() => {
								form.setFieldValue('weatherEffects', form.values.weatherEffects.concat(''));
							}}
							rightIcon={<PlusCircledIcon width={24} height={24} />}>
							Add
						</Button>
					</Group>
				</Stack>
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

export default TerrainsForm;

