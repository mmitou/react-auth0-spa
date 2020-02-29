import { fork } from 'redux-saga/effects';
import * as auth0 from './auth0';
import * as echo from './echo';

// action
export const action = {
	auth0: auth0.action,
	echo: echo.action,
};

// saga
export function* rootSaga() {
	yield fork(auth0.rootSaga);
	yield fork(echo.rootSaga);
}
