import { Avatar, Button, FileInput, Group, Image, MultiSelect, NumberInput, Radio, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ERAS } from '../../../utils/data/common';
import { CompleteTechnologyData, TechnologyData, UnmarshalledTechnology, techValidators } from '../../../utils/data/technologies';
import { makeDLCInputs } from '../../../utils/dlcInputs';
import { getTechsData } from '../../../utils/http';
import FormHorizontalSection from '../FormHorizontalSection';

interface Props {
	onSubmit: (data: CompleteTechnologyData) => void;
	onCancel?: () => void;
	initialValues?: CompleteTechnologyData;
}

interface TechnologyItemProps extends React.ComponentPropsWithoutRef<'div'> {
	tech: UnmarshalledTechnology | null;
}

export const TechItem = forwardRef<HTMLDivElement, TechnologyItemProps>(function TechnologyItem({ tech, ...others }: TechnologyItemProps, ref) {
	return (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={tech ? tech.icon : undefined} />
				<Text size="sm">{tech ? tech.name : ''}</Text>
			</Group>
		</div>
	);
});

const TechsForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
	const [otherTechs, setOtherTechs] = useState<UnmarshalledTechnology[]>([]);
	const form = useForm<TechnologyData>({
		initialValues: initialValues
			? { ...initialValues, eureka: { base: initialValues.eureka.base || '', rf: initialValues.eureka.rf || '', gs: initialValues.eureka.gs || '' } }
			: {
					name: '',
					era: null,
					addedBy: null,
					icon: null,
					description: '',
					cost: { base: 0, rf: null, gs: null },
					dependencies: { base: [], rf: [], gs: [] },
					eureka: { base: '', rf: '', gs: '' },
					otherEffects: { base: [], rf: [], gs: [] }
			  },
		validate: techValidators,
		transformValues: (values) => {
			const copy = { ...values };

			if ('_id' in copy) {
				delete copy._id;
			}

			if (!copy.cost.rf) copy.cost.rf = null;
			if (!copy.cost.gs) copy.cost.gs = null;

			if (!copy.eureka.base) copy.eureka = { ...copy.eureka, base: null };
			if (!copy.eureka.rf) copy.eureka = { ...copy.eureka, rf: null };
			if (!copy.eureka.gs) copy.eureka = { ...copy.eureka, gs: null };

			return copy;
		}
	});

	const preview = useMemo(() => (form.values.icon ? URL.createObjectURL(form.values.icon) : null), [form.values.icon]);

	useEffect(() => {
		getTechsData() // TODO: this as any is kinda ugly
			.then((res) => setOtherTechs(initialValues ? res.data.filter((tech) => tech._id !== (initialValues as any)._id) : res.data));
	}, [initialValues]);

	return (
		<form onSubmit={form.onSubmit((values) => onSubmit(values as CompleteTechnologyData))}>
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
							data={otherTechs.map((tech) => ({ label: tech.name, value: tech._id, tech }))}
							{...form.getInputProps(`dependencies.${dlc}`)}
							itemComponent={TechItem}
							searchable
						/>
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
				<FormHorizontalSection title="Eureka">
					{makeDLCInputs(({ dlc, prettyDLC }) => (
						<TextInput label={prettyDLC} placeholder="Eureka" {...form.getInputProps(`eureka.${dlc}`)} />
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

export default TechsForm;

