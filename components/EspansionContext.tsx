import { createContext, useContext } from 'react';

const ExpansionContext = createContext<Expansion>('base');

export const useExpansion = () => useContext(ExpansionContext);

export const ExpansionProvider = ({ value, children }: React.PropsWithChildren<{ value: Expansion }>) => (
	<ExpansionContext.Provider value={value}>{children}</ExpansionContext.Provider>
);

