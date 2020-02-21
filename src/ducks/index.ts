import { createStore, combineReducers } from 'redux';
import * as auth0 from './auth0';

export type AppState = {
	auth0: auth0.Auth0State;
};

export const appStore = createStore (
	combineReducers<AppState>({
		auth0: auth0.auth0Reducer
	})
);

export type Auth0Client = auth0.Auth0Client;
export { setAuth0ClientAction, setAuth0UserAction } from './auth0';
