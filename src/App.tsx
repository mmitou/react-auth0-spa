import React from 'react';
import 'App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { LoginButton } from 'components/LoginButton';

const history = createBrowserHistory();

function App() {
  return (
		<Router history={history}>
			<LoginButton />
		</Router>
  );
}

export default App;
