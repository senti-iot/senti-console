
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Collection from 'views/Collections/Collection';
import EditCollection from 'views/Collections/EditCollection';

const collection = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`}>
				<EditCollection {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Collection {...props} />
			</Route>
		</Switch>
	)
}

export default collection