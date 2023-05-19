import { Title } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useMemo, useState } from 'react';
import UnitsForm from '../../../components/admin/units/UnitsForm';
import { withAuth } from '../../../utils/auth';
import { CompleteUnitData } from '../../../utils/data/units';
import { getAsset, getUnitById, updateUnit } from '../../../utils/http';
import { FILE_NAME_REGEX, deepDiff } from '../../../utils/utils';

const UnitById: NextPage = () => {
	const router = useRouter();
	const id = useMemo(() => router.query.id as string, [router]);
	const [unit, setUnit] = useState<CompleteUnitData | null>(null);

	useEffect(() => {
		if (id) {
			getUnitById(id).then((res) => {
				const unit = res.data;

				getAsset(res.data.icon).then((res) => {
					const filenameResult = FILE_NAME_REGEX.exec(res.headers['content-disposition']);

					if (!filenameResult) {
						return;
					}

					setUnit({
						...unit,
						icon: new File([res.data], filenameResult[1])
					});
				});
			});
		}
	}, [id]);

	if (!unit) {
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
				<title>CivDB | Admin Panel - Editing Unit</title>
			</Head>
			<UnitsForm
				onSubmit={(data) => {
					console.log(data);
					deepDiff(unit, data).then((diff) => {
						console.log('diff', diff);
						const notifId = randomId();
						notifications.show({ title: 'Submitting...', message: 'Updating unit...', id: notifId, autoClose: 5000, loading: true });
						updateUnit(id, diff)
							.then((res) => {
								router.replace('/admin/units');
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
				initialValues={unit}
				onCancel={() => router.replace('/admin/units')}
			/>
		</>
	);
};

export default withAuth(UnitById, 'CivDB | Admin Panel - Editing Unit');

