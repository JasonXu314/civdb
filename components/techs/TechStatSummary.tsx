import { Anchor, Card, Center, Divider, Image, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { Technology } from '../../utils/data/technologies';
import { normalizeName, prettyExpansion } from '../../utils/utils';
import ExpansionRenderer, { makeExpansionCases } from '../ExpansionRenderer';

interface Props {
	tech: Technology;
}

const TechStatSummary: React.FC<Props> = ({ tech }) => {
	return (
		<Card miw="min(15vw, 300px)" shadow="md" radius="lg" withBorder>
			<Center>
				<Title order={3}>{tech.name}</Title>
			</Center>
			<Center>
				<Image src={tech.icon} height={100} width={100} />
			</Center>
			<Space h="lg" />
			<Center>
				<Title order={4}>Introduced in {prettyExpansion(tech.addedBy)}</Title>
			</Center>
			<ExpansionRenderer
				base={tech.cost.base && <Text>Cost (Base Game): {tech.cost.base}</Text>}
				rf={tech.cost.rf && <Text>Cost (Rise &amp; Fall): {tech.cost.rf}</Text>}
				gs={tech.cost.gs && <Text>Cost (Gathering Storm): {tech.cost.gs}</Text>}
				fallback={<Text>Technology is added by {tech.addedBy}</Text>}
			/>
			<ExpansionRenderer
				base={tech.eureka.base && <Text>Eureka: {tech.eureka.base}</Text>}
				rf={tech.eureka.rf && <Text>Eureka: {tech.eureka.rf}</Text>}
				gs={tech.eureka.gs && <Text>Eureka: {tech.eureka.gs}</Text>}
				fallback={null}
			/>
			<Space h="lg" />
			<Center>
				<Title order={4}>Relationships</Title>
			</Center>
			<SimpleGrid cols={2}>
				<Stack>
					<Title order={5}>Requires</Title>
					<Divider />
					<ExpansionRenderer
						{...makeExpansionCases(
							(exp) =>
								tech.dependencies[exp].map((dep) => (
									<Stack key={dep._id}>
										<Center>
											<Image src={dep.icon} height={50} width={50} />
										</Center>
										<Center>
											<Anchor component={Link} href="/technologies/[name]" as={`/technologies/${normalizeName(dep.name)}`}>
												{dep.name}
											</Anchor>
										</Center>
									</Stack>
								)),
							null
						)}
					/>
				</Stack>
				<Stack>
					<Title order={5}>Required For</Title>
					<Divider />
					<ExpansionRenderer
						{...makeExpansionCases(
							(exp) =>
								tech.dependents[exp].map((dep) => (
									<Stack key={dep._id}>
										<Center>
											<Image src={dep.icon} height={50} width={50} />
										</Center>
										<Center>
											<Anchor component={Link} href="/technologies/[name]" as={`/technologies/${normalizeName(dep.name)}`}>
												{dep.name}
											</Anchor>
										</Center>
									</Stack>
								)),
							null
						)}
					/>
				</Stack>
			</SimpleGrid>
			<Space h="lg" />
			<Center>
				<Title order={4}>Additional Notes</Title>
			</Center>
			<ExpansionRenderer
				{...makeExpansionCases(
					(exp) =>
						tech.otherEffects[exp].length === 0 ? (
							<Text>N/A</Text>
						) : (
							<Stack>
								{tech.otherEffects[exp].map((effect, i) => (
									<Text key={i} maw="15vw">
										{effect}
									</Text>
								))}
							</Stack>
						),
					null
				)}
			/>
		</Card>
	);
};

export default TechStatSummary;

