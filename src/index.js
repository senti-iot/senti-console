import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';
import "assets/css/material-dashboard-react.css?v=1.2.0";

import indexRoutes from "routes/index.js";

const hist = createBrowserHistory();


registerServiceWorker();
ReactDOM.render(
	<Router history={hist}>
		<Switch>
			{indexRoutes.map((prop, key) => {
				return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;
			})}
		</Switch>
	</Router>,
	document.getElementById("root")
);
