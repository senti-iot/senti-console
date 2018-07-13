
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Project from 'views/Projects/Project';
import EditProject from 'components/Project/EditProject';


export default withRouter((props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditProject {...props}/>}/>
			<Route path={`${props.match.url}`} render={() => <Project {...props} />} />
		</Switch>
	)
})