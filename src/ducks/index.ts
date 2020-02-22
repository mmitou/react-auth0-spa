import { combineReducers } from 'redux';
import * as auth0 from './auth0';

// State
export type State = {
	auth0: auth0.State;
};

// reducer
export const reducer = combineReducers<State>({
	auth0: auth0.reducer
});

// action
export const action = {
	auth0: auth0.action
};

export type Auth0Client = auth0.Auth0Client;
