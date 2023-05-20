import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import TechsForm from '../../../components/admin/techs/TechsForm';
import { withAuth } from '../../../utils/auth';
import { CompleteTechnologyData } from '../../../utils/data/technologies';
import { getAsset, getTechById, updateTech } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const TechById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [tech, setTech] = useState<CompleteTechnologyData | null>(null);

	useEffect(() => {
		if (id) {
			getTechById(id).then((res) => {
				const tech = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						console.error('No filename for icon');
						return;
					}

					setTech({
						...tech,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!tech) {
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
				<title>CivDB | Admin Panel - Editing Technology</title>
			</Head>
			<TechsForm
				onSubmit={(data) => {
					deepDiff(tech, data).then((diff) => {
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating technology...', id: notifId, autoClose: 5000, loading: true });
						updateTech(id, diff)
							.then((res) => {
								router.replace('/admin/technologies');
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
				initialValues={tech}
				onCancel={() => router.replace('/admin/technologies')}
			/>
		</>
	);
};

export default withAuth(TechById, 'CivDB | Admin Panel - Editing Technology');

