import { Avatar, Button, Checkbox, FileInput, Group, Image, MultiSelect, NumberInput, Radio, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { UnmarshalledCivic } from '../../../utils/data/civics';
import { ERAS, RESOURCES } from '../../../utils/data/common';
import { UnmarshalledTechnology } from '../../../utils/data/technologies';
import { CompleteUnitData, PROMOTION_CLASSES, UnitData, UnmarshalledUnit, unitValidators } from '../../../utils/data/units';
import { makeDLCInputs } from '../../../utils/dlcInputs';
import { getCivicsData, getTechsData, getUnitsData } from '../../../utils/http';
import FormHorizontalSection from '../FormHorizontalSection';

interface Props {
	onSubmit: (data: CompleteUnitData) => void;
	onCancel?: () => void;
	initialValues?: CompleteUnitData;
}

interface UnitItemProps extends React.ComponentPropsWithoutRef<'div'> {
	unit: UnmarshalledUnit | null;
}

interface UnlockItemProps extends React.ComponentPropsWithoutRef<'div'> {
	tech: UnmarshalledTechnology | null;
	civic: UnmarshalledCivic | null;
}

// TODO: make analogues of this when techs/civics are implemented
const UnitItem = forwardRef<HTMLDivElement, UnitItemProps>(function UnitItem({ unit, ...others }: UnitItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={unit ? unit.icon : undefined} />
				<Text size="sm">{unit ? unit.name : ''}</Text>
			</Group>
		</div>
	);
});

const UnlockItem = forwardRef<HTMLDivElement, UnlockItemProps>(function UnlockItem({ tech, civic, ...others }: UnlockItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group
				noWrap
				sx={(theme) => ({
					borderLeft: tech || civic ? '2px solid' : undefined,
					borderLeftColor: tech ? theme.colors.blue[5] : civic ? theme.colors.violet[9] : undefined
				})}>
				<Avatar src={tech ? tech.icon : civic ? civic.icon : undefined} />
				<Text size="sm">{tech ? tech.name : civic ? civic.name : ''}</Text>
			</Group>
		</div>
	);
});

const UnitsForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const [otherUnits, setOtherUnits] = useState<UnmarshalledUnit[]>([]);
	const [techs, setTechs] = useState<UnmarshalledTechnology[]>([]);
	const [civics, setCivics] = useState<UnmarshalledCivic[]>([]);
	const form = useForm<UnitData>({
		initialValues: initialValues || {
			name: '',
			promotionClass: null,
			era: null,
			addedBy: null,
			production: { base: 0, rf: null, gs: null },
			gold: { base: 0, rf: null, gs: null },
			maintenance: { base: 0, rf: null, gs: null },
			resource: { base: null, rf: null, gs: null },
			maintenanceResource: { base: null, rf: null, gs: null },
			icon: null,
			unique: false,
			movement: 0,
			sight: 0,
			strength: 0,
			range: 0,
			rangedStrength: null,
			bombardStrength: null,
			aaStrength: null,
			replaces: { base: null, rf: null, gs: null },
			description: '',
			unlockedBy: { base: null, rf: null, gs: null },
			obsoletedBy: { base: null, rf: null, gs: null },
			upgradesFrom: { base: [], rf: [], gs: [] },
			upgradesTo: { base: [], rf: [], gs: [] }
		},
		validate: unitValidators,
		transformValues: (values) => {
			const copy = { ...values };

			if ('_id' in copy) {
				delete copy._id;
			}

			(['production', 'gold', 'maintenance'] as const).forEach((key) => {
				if (!copy[key].base) copy[key].base = null;
				if (!copy[key].rf) copy[key].rf = null;
				if (!copy[key].gs) copy[key].gs = null;
			});

			if (copy.range === 0) {
				if (copy.rangedStrength !== null) copy.rangedStrength = null;
				if (copy.bombardStrength !== null) copy.bombardStrength = null;
			} else {
				if ((copy.bombardStrength as any) === '') copy.bombardStrength = null;
			}

			if (!copy.aaStrength) copy.aaStrength = null;

			(['unlockedBy', 'obsoletedBy'] as const).forEach((key) => {
				if (!copy[key].base) copy[key].base = null;
				if (!copy[key].rf) copy[key].rf = null;
				if (!copy[key].gs) copy[key].gs = null;
			});

			return copy;
		}
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);
	const otherUnitsData = useMemo(() => otherUnits.map((unit) => ({ label: unit.name, value: unit._id, unit })), [otherUnits]);

	useEffect(() => {
		getUnitsData() // TODO: this as any is kinda ugly
			.then((res) => setOtherUnits(initialValues ? res.data.filter((unit) => unit._id !== (initialValues as any)._id) : res.data));
	}, [initialValues]);

	useEffect(() => {
		getCivicsData().then((res) => setCivics(res.data));
		getTechsData().then((res) => setTechs(res.data));
	}, []);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteUnitData))}>
			<Stack>
				<TextInput label="Name" placeholder="Unit Name" {...form.getInputProps('name')} />
				<FileInput label="Icon" {...form.getInputProps('icon')} />
				{form.values.icon && <Image src={preview} height={75} width={75} />}
				<Select label="Promotion Class" data={PROMOTION_CLASSES} {...form.getInputProps('promotionClass')} />
				<Select label="Unit Era" data={ERAS} {...form.getInputProps('era')} />
				<Radio.Group label="DLC Added" {...form.getInputProps('addedBy')}>
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Radio label={prettyDLC} value={dlc} />
					))}
				</Radio.Group>
				<FormHorizontalSection title="Production">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`production.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Gold">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`gold.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Maintenance">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`maintenance.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Resource Costs">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Stack>
							<Title order={5}>{prettyDLC}</Title>
							<Checkbox
								label="Costs resource"
								{...form.getInputProps(`resource.${dlc}`, { type: 'checkbox' })}
								checked={!!form.values.resource[dlc]}
								onChange={(evt) => {
									if (evt.target.checked) {
										form.setFieldValue(`resource.${dlc}`, { resource: null, quantity: 0 });
									} else {
										form.setFieldValue(`resource.${dlc}`, null);
									}
								}}
							/>
							{form.values.resource[dlc] && (
								<>
									<Select label="Resource" data={RESOURCES} {...form.getInputProps(`resource.${dlc}.resource`)} />
									<NumberInput label="Quantity" {...form.getInputProps(`resource.${dlc}.quantity`)} />
								</>
							)}
						</Stack>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Resource Maintenance">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Stack>
							<Title order={5}>{prettyDLC}</Title>
							<Checkbox
								label="Costs resource"
								{...form.getInputProps(`resource.${dlc}`, { type: 'checkbox' })}
								checked={!!form.values.maintenanceResource[dlc]}
								onChange={(evt) => {
									if (evt.target.checked) {
										form.setFieldValue(`maintenanceResource.${dlc}`, { resource: null, quantity: 0 });
									} else {
										form.setFieldValue(`maintenanceResource.${dlc}`, null);
									}
								}}
							/>
							{form.values.maintenanceResource[dlc] && (
								<>
									<Select label="Resource" data={RESOURCES} {...form.getInputProps(`maintenanceResource.${dlc}.resource`)} />
									<NumberInput label="Quantity" {...form.getInputProps(`maintenanceResource.${dlc}.quantity`)} />
								</>
							)}
						</Stack>
					))}
				</FormHorizontalSection>
				<Checkbox label="Unique" {...form.getInputProps('unique')} />
				{form.values.unique && (
					<FormHorizontalSection title="Replaced Unit">
						{makeDLCInputs(({ dlc, prettyDLC }) => (
							<Select
								label={prettyDLC}
								data={dlc === 'base' ? otherUnitsData : [{ label: '', value: '', unit: null }, ...otherUnitsData]}
								{...form.getInputProps(`replaces.${dlc}`)}
								itemComponent={UnitItem}
								searchable
							/>
						))}
					</FormHorizontalSection>
				)}
				<FormHorizontalSection title="Combat Stats">
					<NumberInput label="Movement" {...form.getInputProps('movement')} />
					<NumberInput label="Sight" {...form.getInputProps('sight')} />
					<NumberInput label="Strength" {...form.getInputProps('strength')} />
					<NumberInput label="Range" {...form.getInputProps('range')} />
					<NumberInput label="AA" {...form.getInputProps('aaStrength')} />
				</FormHorizontalSection>
				{form.values.range > 0 && (
					<FormHorizontalSection title="Ranged Stats">
						<NumberInput label="Ranged Strength" {...form.getInputProps('rangedStrength')} />
						<NumberInput label="Bombard Strength" {...form.getInputProps('bombardStrength')} />
					</FormHorizontalSection>
				)}
				<FormHorizontalSection title="Unlocked By">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Select
							label={prettyDLC}
							data={[
								{ label: '', value: '', tech: null, civic: null },
								...techs.map((tech) => ({ label: tech.name, value: tech._id, tech })),
								...civics.map((civic) => ({ label: civic.name, value: civic._id, civic }))
							]}
							{...form.getInputProps(`unlockedBy.${dlc}`)}
							itemComponent={UnlockItem}
							searchable
						/>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Obsoleted By">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Select
							label={prettyDLC}
							data={[
								{ label: '', value: '', tech: null, civic: null },
								...techs.map((tech) => ({ label: tech.name, value: tech._id, tech })),
								...civics.map((civic) => ({ label: civic.name, value: civic._id, civic }))
							]}
							{...form.getInputProps(`obsoletedBy.${dlc}`)}
							itemComponent={UnlockItem}
							searchable
						/>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Upgrades From">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<MultiSelect
							label={prettyDLC}
							data={otherUnitsData}
							{...form.getInputProps(`upgradesFrom.${dlc}`)}
							itemComponent={UnitItem}
							searchable
						/>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Upgrades To">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<MultiSelect
							label={prettyDLC}
							data={otherUnitsData}
							{...form.getInputProps(`upgradesTo.${dlc}`)}
							itemComponent={UnitItem}
							searchable
						/>
					))}
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

export default UnitsForm;

