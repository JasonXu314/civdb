import { Box, Group, Title } from '@mantine/core';
import { PropsWithChildren } from 'react';

interface Props {
	title: string;
}

const FormHorizontalSection: React.FC<PropsWithChildren<Props>> = ({ title, children }) => {
	return (
		<Box>
			<Title order={4}>{title}</Title>
			<Group align="baseline" noWrap grow>
				{children}
			</Group>
		</Box>
	);
};

export default FormHorizontalSection;

