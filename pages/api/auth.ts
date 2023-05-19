import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method !== 'POST') {
		return res.status(405).send('Invalid Method');
	}

	const secret = req.cookies['civdb:secret'];
	console.log(secret);
	await axios
		.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`, { secret })
		.then(() => {
			res.status(200).send(null);
		})
		.catch(() => {
			res.status(401).send(null);
		});
};

