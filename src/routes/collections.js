import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collections from 'views/Collections/Collections';
import CreateCollection from 'views/Collections/CreateCollection';

const collections = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateCollection {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Collections {...props} />
			</Route>
		</Switch>
	)
}

export default collections