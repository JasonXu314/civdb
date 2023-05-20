import { Avatar, Button, FileInput, Group, Image, MultiSelect, NumberInput, Radio, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckIcon, CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ERAS } from '../../../utils/data/common';
import { CompleteTechnologyData, TechnologyData, UnmarshalledTechnology, techValidators } from '../../../utils/data/technologies';
import { makeExpansionInputs } from '../../../utils/expansionInputs';
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
					{makeExpansionInputs(({ expansion, prettyExpansion }) => (
						<Radio label={prettyExpansion} value={expansion} />
					))}
				</Radio.Group>
				<Textarea label="Description" placeholder="Technology Description" {...form.getInputProps('description')} />
				<FormHorizontalSection title="Research Cost">
					{makeExpansionInputs(({ expansion, prettyExpansion }) => (
						<NumberInput label={prettyExpansion} {...form.getInputProps(`cost.${expansion}`)} />
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Dependencies">
					{makeExpansionInputs(({ expansion, prettyExpansion }) => (
						<MultiSelect
							label={prettyExpansion}
							data={otherTechs.map((tech) => ({ label: tech.name, value: tech._id, tech }))}
							{...form.getInputProps(`dependencies.${expansion}`)}
							itemComponent={TechItem}
							searchable
						/>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Other Effects">
					{makeExpansionInputs(({ expansion, prettyExpansion }) => (
						<Stack>
							<Title order={5}>{prettyExpansion}</Title>
							{form.values.otherEffects[expansion].map((_, i) => (
								<TextInput key={i} {...form.getInputProps(`otherEffects.${expansion}.${i}`)} />
							))}
							<Group position="center">
								<Button
									onClick={() => {
										form.setFieldValue(`otherEffects.${expansion}`, form.values.otherEffects[expansion].concat(''));
									}}
									rightIcon={<PlusCircledIcon width={24} height={24} />}>
									Add
								</Button>
							</Group>
						</Stack>
					))}
				</FormHorizontalSection>
				<FormHorizontalSection title="Eureka">
					{makeExpansionInputs(({ expansion, prettyExpansion }) => (
						<TextInput label={prettyExpansion} placeholder="Eureka" {...form.getInputProps(`eureka.${expansion}`)} />
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

