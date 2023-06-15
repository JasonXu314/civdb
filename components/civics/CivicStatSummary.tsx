import { Anchor, Card, Center, Divider, Image, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { Civic } from '../../utils/data/civics';
import { prettyExpansion } from '../../utils/utils';
import ExpansionRenderer, { makeExpansionCases } from '../ExpansionRenderer';

interface Props {
	civic: Civic;
}

const CivicStatSummary: React.FC<Props> = ({ civic }) => {
	return (
		<Card miw="min(15vw, 300px)" shadow="md" radius="lg" withBorder>
			<Center>
				<Title order={3}>{civic.name}</Title>
			</Center>
			<Center>
				<Image src={civic.icon} height={100} width={100} />
			</Center>
			<Space h="lg" />
			<Center>
				<Title order={4}>Introduced in {prettyExpansion(civic.addedBy)}</Title>
			</Center>
			<ExpansionRenderer
				base={civic.cost.base && <Text>Cost (Base Game): {civic.cost.base}</Text>}
				rf={civic.cost.rf && <Text>Cost (Rise &amp; Fall): {civic.cost.rf}</Text>}
				gs={civic.cost.gs && <Text>Cost (Gathering Storm): {civic.cost.gs}</Text>}
				fallback={<Text>Technology is added by {civic.addedBy}</Text>}
			/>
			<ExpansionRenderer
				base={civic.inspiration.base && <Text>Inspiration: {civic.inspiration.base}</Text>}
				rf={civic.inspiration.rf && <Text>Inspiration: {civic.inspiration.rf}</Text>}
				gs={civic.inspiration.gs && <Text>Inspiration: {civic.inspiration.gs}</Text>}
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
								civic.dependencies[exp].map((dep) => (
									<Stack key={dep._id}>
										<Center>
											<Image src={dep.icon} height={50} width={50} />
										</Center>
										<Center>
											<Anchor component={Link} href="/civics/[name]" as={`/civics/${dep.name}`}>
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
								civic.dependents[exp].map((dep) => (
									<Stack key={dep._id}>
										<Center>
											<Image src={dep.icon} height={50} width={50} />
										</Center>
										<Center>
											<Anchor component={Link} href="/civics/[name]" as={`/civics/${dep.name}`}>
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
						civic.otherEffects[exp].length === 0 && !civic.envoys[exp] && !civic.governorTitles[exp] ? (
							<Text>N/A</Text>
						) : (
							<Stack>
								{civic.envoys[exp] && <Text>Awards {civic.envoys[exp]} Envoys</Text>}
								{civic.governorTitles[exp] && <Text>Awards {civic.governorTitles[exp]} Governor Titles</Text>}
								{civic.otherEffects[exp].map((effect, i) => (
									<Text key={i}>{effect}</Text>
								))}
							</Stack>
						),
					null
				)}
			/>
		</Card>
	);
};

export default CivicStatSummary;

