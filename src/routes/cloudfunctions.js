import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CloudFunctions from 'views/Cloud/CloudFunctions';
// import CreateProject from 'components/Project/CreateProject';
import CreateCloudFunction from 'views/Cloud/CreateCloudFunction';

const cloudfunctions = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateCloudFunction {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<CloudFunctions {...props} />
			</Route>
		</Switch>
	)
}

export default cloudfunctions