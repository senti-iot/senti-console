
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EditCloudFunction from 'views/Cloud/EditCloudFunction';
import CloudFunction from 'views/Cloud/CloudFunction';

const cloudfunction = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`}>
				<EditCloudFunction {...props} />
			</Route>
			<Route path={`${props.match.url}`}>
				<CloudFunction {...props} />
			</Route>
		</Switch>
	)
}

export default cloudfunction