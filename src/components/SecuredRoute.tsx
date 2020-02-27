import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { State, User } from 'ducks';
import { useSelector, shallowEqual } from 'react-redux';

type ContentProps = {
	  children: ReactNode;
	  path: string;
}

export const SecuredRoute: React.FC<ContentProps> = ({children, path}) => {
	const user = useSelector<State, User | null>(state => state.auth0.user, shallowEqual);
	return (
		<Route exact path={path}>
			{ !!user ? children : <div>not authenticated</div> }
		</Route>
	);
};
