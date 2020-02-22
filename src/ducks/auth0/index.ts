import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import createAuth0Client from '@auth0/auth0-spa-js';

type PromiseWithAuth0Client = ReturnType<typeof createAuth0Client>;
type ResolvedType<T> = T extends Promise<infer R> ? R : never;
export type Auth0Client = ResolvedType<PromiseWithAuth0Client>;

// state
export type State = {
	client?: Auth0Client ;
	user?: any ;
	error?: Error;
};

// action
const actionCreator = actionCreatorFactory();
export const action = {
	setAuth0Client: actionCreator<Auth0Client>('auth0/SET_AUTH0CLIENT'),
	setAuth0User: actionCreator<any>('auth0/SET_AUTH0USER'),
};

// reducer
export const reducer = reducerWithInitialState({})
	.case(action.setAuth0Client, (state: State, client: Auth0Client | null) => {return {...state, client};})
	.case(action.setAuth0User, (state: State, user: any | null) => {return {...state, user};});
