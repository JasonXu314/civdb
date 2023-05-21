import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import CivicsForm from '../../../components/admin/civics/CivicsForm';
import { withAuth } from '../../../utils/auth';
import { CompleteCivicData } from '../../../utils/data/civics';
import { getAsset, getCivicById, updateCivic } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const CivicById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [civic, setCivic] = useState<CompleteCivicData | null>(null);

	useEffect(() => {
		if (id) {
			getCivicById(id).then((res) => {
				const civic = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						console.error('No filename for icon');
						return;
					}

					setCivic({
						...civic,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!civic) {
		return (
			<>
				<Head>
					<title>CivDB | Admin Panel - Loading...</title>
				</Head>
				<Title>Loading...</Title>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - Editing Civic</title>
			</Head>
			<CivicsForm
				onSubmit={(data) => {
					deepDiff(civic, data).then((diff) => {
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating civic...', id: notifId, autoClose: 5000, loading: true });
						updateCivic(id, diff)
							.then((res) => {
								router.replace('/admin/civics');
								notifications.update({
									id: notifId,
									title: 'Success!',
									message: `Successfully updated ${res.data.name}`,
									autoClose: 5000,
									color: 'green',
									icon: <CheckIcon color="white" width={24} height={24} />
								});
							})
							.catch((err: AxiosError<ErrorResponse>) => {
								console.log(err);
								if (err.response) {
									notifications.update({
										id: notifId,
										title: 'Error...',
										message: err.response.data.message,
										autoClose: 5000,
										color: 'red',
										icon: <CrossCircledIcon color="white" width={24} height={24} />
									});
								}
							});
					});
				}}
				initialValues={civic}
				onCancel={() => router.replace('/admin/civics')}
			/>
		</>
	);
};

export default withAuth(CivicById, 'CivDB | Admin Panel - Editing Civic');

