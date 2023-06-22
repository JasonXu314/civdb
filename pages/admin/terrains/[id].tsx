import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import TerrainsForm from '../../../components/admin/terrains/TerrainsForm';
import { withAuth } from '../../../utils/auth';
import { CompleteTerrainData } from '../../../utils/data/terrains';
import { getAsset, getTerrainById, updateTerrain } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const TerrainById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [terrain, setTerrain] = useState<CompleteTerrainData | null>(null);

	useEffect(() => {
		if (id) {
			getTerrainById(id).then((res) => {
				const terrain = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						console.error('No filename for icon');
						return;
					}

					setTerrain({
						...terrain,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!terrain) {
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
				<title>CivDB | Admin Panel - Editing Terrain</title>
			</Head>
			<TerrainsForm
				onSubmit={(data) => {
					deepDiff(terrain, data).then((diff) => {
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating terrain...', id: notifId, autoClose: 5000, loading: true });
						updateTerrain(id, diff)
							.then((res) => {
								router.replace('/admin/terrains');
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
				initialValues={terrain}
				onCancel={() => router.replace('/admin/terrains')}
			/>
		</>
	);
};

export default withAuth(TerrainById, 'CivDB | Admin Panel - Editing Terrain');

