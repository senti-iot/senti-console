
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Project from 'views/Projects/Project';
import CreateProject from 'components/Project/CreateProject';


export default withRouter( (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <CreateProject {...props}/>}/>
			<Route path={`${props.match.url}`} render={() => <Project {...props} />} />
		</Switch>
	)
})