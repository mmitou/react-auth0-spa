import React from 'react';
import 'App.css';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { LoginButton } from 'components/LoginButton';
import * as ducks from 'ducks';
import * as sagas from 'sagas';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	ducks.reducer,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas.rootSaga);


function App() {
  return (
		<Provider store={store}>
			<Router history={history}>
				<LoginButton />
			</Router>
		</Provider>
  );
}

export default App;
