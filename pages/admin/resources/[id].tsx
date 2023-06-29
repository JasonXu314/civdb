import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import ResourcesForm from '../../../components/admin/resources/ResourcesForm';
import { withAuth } from '../../../utils/auth';
import { CompleteResourceData } from '../../../utils/data/resources';
import { getAsset, getResourceById, updateResource } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const ResourceById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [resource, setResource] = useState<CompleteResourceData | null>(null);

	useEffect(() => {
		if (id) {
			getResourceById(id).then((res) => {
				const resource = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						console.error('No filename for icon');
						return;
					}

					setResource({
						...resource,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!resource) {
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
				<title>CivDB | Admin Panel - Editing Resource</title>
			</Head>
			<ResourcesForm
				onSubmit={(data) => {
					deepDiff(resource, data).then((diff) => {
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating resource...', id: notifId, autoClose: 5000, loading: true });
						updateResource(id, diff)
							.then((res) => {
								router.replace('/admin/resources');
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
				initialValues={resource}
				onCancel={() => router.replace('/admin/resources')}
			/>
		</>
	);
};

export default withAuth(ResourceById, 'CivDB | Admin Panel - Editing Resource');

