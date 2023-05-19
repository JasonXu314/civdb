import { Button, Group, Stack, Title } from '@mantine/core';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import UnitListEntry from '../../../components/admin/units/UnitListEntry';
import { withAuth } from '../../../utils/auth';
import { UnmarshalledUnit } from '../../../utils/data/units';
import { getUnitsData } from '../../../utils/http';

const Index: NextPage = () => {
	const [units, setUnits] = useState<UnmarshalledUnit[] | null>(null);

	useEffect(() => {
		getUnitsData()
			.then((res) => {
				setUnits(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!units) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Units</title>
				</Head>
				<Title>Loading Units...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Units</title>
			</Head>
			<Stack>
				<Group>
					<Button leftIcon={<PlusCircledIcon />} component={Link} href="/admin/units/new">
						Create
					</Button>
				</Group>
				{units.map((unit) => (
					<UnitListEntry unit={unit} key={unit._id} />
				))}
			</Stack>
		</>
	);
};

export default withAuth(Index, 'Admin Panel - Units');

