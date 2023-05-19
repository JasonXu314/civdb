import { Title } from '@mantine/core';
import Head from 'next/head';
import { NextPage } from 'next/types';
import { withAuth } from '../../utils/auth';

const Admin: NextPage = () => {
	return (
		<>
			<Head>
				<title>CivDB | Admin Panel</title>
			</Head>
			<Title>Admin</Title>
		</>
	);
};

export default withAuth(Admin, 'Admin Panel');

