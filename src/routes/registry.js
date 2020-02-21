
import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import Collection from 'views/Collections/Collection';
import EditRegistry from 'views/Registries/EditRegistry';
import Registry from 'views/Registries/Registry';

const registry = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`}>
				<EditRegistry {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Registry {...props} />
			</Route>
		</Switch>
	)
}

export default registry