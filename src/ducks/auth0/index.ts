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
	error: Error | null;
};

// action
const actionCreator = actionCreatorFactory();
export const action = {
	setAuth0Client: actionCreator<Auth0Client>('auth0/SET_AUTH0CLIENT'),
	setAuth0User: actionCreator<User>('auth0/SET_AUTH0USER'),
};

const dummyUser = {
	nickname: "masayuki.itou.work",
	name: "masayuki.itou.work@gmail.com",
	picture: "https://s.gravatar.com/avatar/2149ba262dc19f3d47453f774f23411b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png",
	updated_at: "2020-02-23T09:24:50.114Z",
	email: "masayuki.itou.work@gmail.com",
	email_verified: true,
	sub: "auth0|5e312fec5e7dad0e61a1efc1"
};

// reducer
const initialState: State = {client: null, user: dummyUser, error: null };
export const reducer = reducerWithInitialState(initialState)
	.case(action.setAuth0Client, (state: State, client: Auth0Client | null): State => {return {...state, client};})
	.case(action.setAuth0User, (state: State, user: User | null): State => {return {...state, user};});
