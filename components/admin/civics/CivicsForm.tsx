import { Avatar, Button, FileInput, Group, Image, MultiSelect, NumberInput, Radio, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { CivicData, CompleteCivicData, UnmarshalledCivic, civicValidators } from '../../../utils/data/civics';
import { ERAS } from '../../../utils/data/common';
import { makeDLCInputs } from '../../../utils/dlcInputs';
import { getCivicsData } from '../../../utils/http';
import FormHorizontalSection from '../FormHorizontalSection';

interface Props {
	onSubmit: (data: CompleteCivicData) => void;
	onCancel?: () => void;
	initialValues?: CompleteCivicData;
}

interface CivicItemProps extends React.ComponentPropsWithoutRef<'div'> {
	civic: UnmarshalledCivic | null;
}

export const CivicItem = forwardRef<HTMLDivElement, CivicItemProps>(function CivicItem({ civic, ...others }: CivicItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={civic ? civic.icon : undefined} />
				<Text size="sm">{civic ? civic.name : ''}</Text>
			</Group>
		</div>
	);
});

const CivicsForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const [otherCivics, setOtherCivics] = useState<UnmarshalledCivic[]>([]);
	const form = useForm<CivicData>({
		initialValues: initialValues
			? {
					...initialValues,
					inspiration: { base: initialValues.inspiration.base || '', rf: initialValues.inspiration.rf || '', gs: initialValues.inspiration.gs || '' }
			  }
			: {
					name: '',
					era: null,
					addedBy: null,
					icon: null,
					description: '',
					cost: { base: 0, rf: null, gs: null },
					envoys: { base: 0, rf: null, gs: null },
					governorTitles: { base: 0, rf: null, gs: null },
					dependencies: { base: [], rf: [], gs: [] },
					inspiration: { base: '', rf: '', gs: '' },
					otherEffects: { base: [], rf: [], gs: [] }
			  },
		validate: civicValidators,
		transformValues: (values) => {
			const copy = { ...values };

			if ('_id' in copy) {
				delete copy._id;
			}

			if (!copy.inspiration.base) copy.inspiration = { ...copy.inspiration, base: null };
			if (!copy.inspiration.rf) copy.inspiration = { ...copy.inspiration, rf: null };
			if (!copy.inspiration.gs) copy.inspiration = { ...copy.inspiration, gs: null };

			if ((copy.envoys.rf as any) === '') copy.envoys = { ...copy.envoys, rf: null };
			if ((copy.envoys.gs as any) === '') copy.envoys = { ...copy.envoys, gs: null };
			if ((copy.governorTitles.rf as any) === '') copy.governorTitles = { ...copy.governorTitles, rf: null };
			if ((copy.governorTitles.gs as any) === '') copy.governorTitles = { ...copy.governorTitles, gs: null };

			return copy;
		}
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);

	useEffect(() => {
		getCivicsData() // TODO: this as any is kinda ugly
			.then((res) => setOtherCivics(initialValues ? res.data.filter((tech) => tech._id !== (initialValues as any)._id) : res.data));
	}, [initialValues]);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteCivicData))}>
			<Stack>
				<TextInput label="Name" placeholder="Technology Name" {...form.getInputProps('name')} />
				<FileInput label="Icon" {...form.getInputProps('icon')} />
				{form.values.icon && <Image src={preview} height={75} width={75} />}
				<Select label="Technology Era" data={ERAS} {...form.getInputProps('era')} />
				<Radio.Group label="DLC Added" {...form.getInputProps('addedBy')}>
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Radio label={prettyDLC} value={dlc} />
					))}
				</Radio.Group>
				<Textarea label="Description" placeholder="Technology Description" {...form.getInputProps('description')} />
				<FormHorizontalSection title="Research Cost">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`cost.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Dependencies">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<MultiSelect
							label={prettyDLC}
							data={otherCivics.map((tech) => ({ label: tech.name, value: tech._id, tech }))}
							{...form.getInputProps(`dependencies.${dlc}`)}
							itemComponent={CivicItem}
							searchable
						/>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Envoys Rewarded">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`envoys.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Governor Titles Rewarded">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<NumberInput label={prettyDLC} {...form.getInputProps(`governorTitles.${dlc}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Other Effects">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<Stack>
							<Title order={5}>{prettyDLC}</Title>
							{form.values.otherEffects[dlc].map((_, i) => (
								<TextInput key={i} {...form.getInputProps(`otherEffects.${dlc}.${i}`)} />
							))}
							<Group position="center">
								<Button
									onClick={() => {
										form.setFieldValue(`otherEffects.${dlc}`, form.values.otherEffects[dlc].concat(''));
									}}
									rightIcon={<PlusCircledIcon width={24} height={24} />}>
									Add
								</Button>
							</Group>
						</Stack>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Inspiration">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<TextInput label={prettyDLC} placeholder="Inspiration" {...form.getInputProps(`inspiration.${dlc}`)} />
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

export default CivicsForm;

