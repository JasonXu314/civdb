import { Anchor, Stack, Title } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { withAuth } from '../../utils/auth';

const Admin: NextPage = () => {
	return (
		<>
			<Head>
				<title>CivDB | Admin Panel</title>
			</Head>
			<Title mb="lg">Admin</Title>
			<Stack>
				<Anchor component={Link} href="/admin/civics">
					Civics
				</Anchor>
				<Anchor component={Link} href="/admin/technologies">
					Technologies
				</Anchor>
				<Anchor component={Link} href="/admin/technologies">
					Units
				</Anchor>
				<Anchor component={Link} href="/admin/terrains">
					Terrains
				</Anchor>
			</Stack>
		</>
	);
};

export default withAuth(Admin, 'Admin Panel');

