import { combineReducers } from 'redux';
import * as auth0 from './auth0';
import * as echo from './echo';

// State
export type State = {
	auth0: auth0.State;
	echo: echo.State;
};

// reducer
export const reducer = combineReducers<State>({
	auth0: auth0.reducer,
	echo: echo.reducer
});

// action
export const action = {
	auth0: auth0.action,
	echo: echo.action
};

export type Auth0Client = auth0.Auth0Client;
export type User = auth0.User;
