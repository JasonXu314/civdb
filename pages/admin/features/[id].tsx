import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import FeaturesForm from '../../../components/admin/features/FeaturesForm';
import { withAuth } from '../../../utils/auth';
import { CompleteFeatureData } from '../../../utils/data/features';
import { getAsset, getFeatureById, updateFeature } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const FeatureById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [feature, setFeature] = useState<CompleteFeatureData | null>(null);

	useEffect(() => {
		if (id) {
			getFeatureById(id).then((res) => {
				const feature = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						console.error('No filename for icon');
						return;
					}

					setFeature({
						...feature,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!feature) {
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
				<title>CivDB | Admin Panel - Editing Feature</title>
			</Head>
			<FeaturesForm
				onSubmit={(data) => {
					deepDiff(feature, data).then((diff) => {
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating feature...', id: notifId, autoClose: 5000, loading: true });
						updateFeature(id, diff)
							.then((res) => {
								router.replace('/admin/features');
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
				initialValues={feature}
				onCancel={() => router.replace('/admin/features')}
			/>
		</>
	);
};

export default withAuth(FeatureById, 'CivDB | Admin Panel - Editing Feature');

