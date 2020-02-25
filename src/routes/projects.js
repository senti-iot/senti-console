import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Projects from 'views/Projects/Projects';
import CreateProject from 'components/Project/CreateProject';

const projects = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateProject {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Projects {...props} />
			</Route>
		</Switch>
	)
}

export default projects