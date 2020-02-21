import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import createAuth0Client from '@auth0/auth0-spa-js';

type PromiseWithAuth0Client = ReturnType<typeof createAuth0Client>;
type ResolvedType<T> = T extends Promise<infer R> ? R : never;
export type Auth0Client = ResolvedType<PromiseWithAuth0Client>;

// state
export type Auth0State = {
	client?: Auth0Client ;
	user?: any ;
	error?: Error;
};

// action
const actionCreator = actionCreatorFactory();
export const setAuth0ClientAction = actionCreator<Auth0Client>('auth0/SET_AUTH0CLIENT');
export const setAuth0UserAction = actionCreator<any>('auth0/SET_AUTH0USER');

// reducer

export const auth0Reducer = reducerWithInitialState({})
	.case(setAuth0ClientAction, (state: Auth0State, client: Auth0Client | null) => {return {...state, client};})
	.case(setAuth0UserAction, (state: Auth0State, user: any | null) => {return {...state, user};});
