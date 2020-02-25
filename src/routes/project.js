
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Project from 'views/Projects/Project';
import EditProject from 'components/Project/EditProject';

const project = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`}>
				<EditProject {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Project {...props} />
			</Route>
		</Switch>
	)
}

export default project