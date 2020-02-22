import { createStore, combineReducers } from 'redux';
import * as auth0 from './auth0';

export type AppState = {
	auth0: auth0.State;
};

export const store = createStore (
	combineReducers<AppState>({
		auth0: auth0.reducer
	})
);

export const action = {
	auth0: { ...auth0.action }
};

export type Auth0Client = auth0.Auth0Client;
