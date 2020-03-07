import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import createAuth0Client from '@auth0/auth0-spa-js';

type PromiseWithAuth0Client = ReturnType<typeof createAuth0Client>;
type ResolvedType<T> = T extends Promise<infer R> ? R : never;
export type Auth0Client = ResolvedType<PromiseWithAuth0Client>;
export type User = {
	name: string;
	picture: string;
};

// state
export type State = {
	client: Auth0Client | null;
	user: User | null;
};

// action
const actionCreator = actionCreatorFactory('auth0');
export const action = {
	setClient: actionCreator<Auth0Client>('SET_AUTH0CLIENT'),
	setUser: actionCreator<User|null>('SET_AUTH0USER'),
};

// reducer
const initialState: State = {client: null, user: null};
export const reducer = reducerWithInitialState(initialState)
	.case(action.setClient, (state: State, client: Auth0Client | null): State => {return {...state, client};})
	.case(action.setUser, (state: State, user: User | null): State => {return {...state, user};});
