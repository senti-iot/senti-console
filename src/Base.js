import React from 'react'
import { Switch, Route } from 'react-router-dom';
import indexRoutes from 'routes';
import { hot } from 'react-hot-loader/root';

const Base = () => {
	return (
		<Switch>
			{indexRoutes.map((prop, key) => {
				return <Route path={prop.path} key={key} exact={prop.exact ? true : false} >
					<prop.component />
				</Route>;
			})}
		</Switch>
	)
}

export default hot(Base)
