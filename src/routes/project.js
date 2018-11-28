
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Project from 'views/Projects/Project';
import EditProject from 'components/Project/EditProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';


const project = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditProject {...props}/>}/>
			<Route path={`${props.match.url}`} render={() => <Project {...props} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(project)