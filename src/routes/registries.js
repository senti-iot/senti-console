import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Registries from 'views/Registries/Registries';
// import CreateProject from 'components/Project/CreateProject';
import CreateRegistry from 'views/Registries/CreateRegistry';

const registries = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateRegistry {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Registries {...props} />
			</Route>
		</Switch>
	)
}

export default registries