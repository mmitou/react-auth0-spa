import { fork } from 'redux-saga/effects';
import * as auth0 from './auth0';

// action
export const action = {
	auth0: auth0.action 
};

// saga
export function* rootSaga() {
	yield fork(auth0.rootSaga);
}
