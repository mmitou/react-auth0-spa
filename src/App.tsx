import React from 'react';
import 'App.css';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'react-bootstrap';
import * as ducks from 'ducks';
import * as sagas from 'sagas';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Home } from 'components/Home';
import { About } from 'components/About';
import { Callback } from 'components/Callback';
import { NavigationBar } from 'components/NavigationBar';
import { SecuredRoute } from 'components/SecuredRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// browser history
const history = createBrowserHistory();

// redux, saga
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	ducks.reducer,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas.rootSaga);

// fontawsome
library.add(faUser);
library.add(faPowerOff);

function App() {
  return (
		<Provider store={store}>
			<Router history={history}>
				<NavigationBar />
				<Container>
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<SecuredRoute path="/about">
							<About />
						</SecuredRoute>
						<Route exact path="/callback">
							<Callback />
						</Route>
					</Switch>
				</Container>
			</Router>
		</Provider>
  );
}

export default App;
