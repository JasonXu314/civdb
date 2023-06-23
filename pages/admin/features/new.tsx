import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import FeaturesForm from '../../../components/admin/features/FeaturesForm';
import { withAuth } from '../../../utils/auth';
import { createFeature } from '../../../utils/http';

const New: NextPage = () => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>CivDB | Admin Panel - New Feature</title>
			</Head>
			<FeaturesForm
				onSubmit={(data) => {
					const id = randomId();
					notifications.show({ title: 'Submitting...', message: 'Creating feature...', id, autoClose: 5000, loading: true });
					createFeature(data)
						.then((res) => {
							router.replace('/admin/features');
							notifications.update({
								id,
								title: 'Success!',
								message: `Successfully created ${res.data.name}`,
								autoClose: 5000,
								color: 'green',
								icon: <CheckIcon color="white" width={24} height={24} />
							});
						})
						.catch((err: AxiosError<ErrorResponse>) => {
							console.log(err);
							if (err.response) {
								notifications.update({
									id,
									title: 'Error...',
									message: err.response.data.message,
									autoClose: 5000,
									color: 'red',
									icon: <CrossCircledIcon color="white" width={30} height={30} />
								});
							}
						});
				}}
				onCancel={() => router.replace('/admin/features')}
			/>
		</>
	);
};

export default withAuth(New, 'Admin Panel - New Feature');

