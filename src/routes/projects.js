import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Projects from 'views/Projects/Projects';
import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';

const projects = (props) => {
	return (
		<Switch>
			<Route path={'/projects/new'} component={(rp) => <CreateProject {...props} {...rp}/>}/>
			<Route path={'/projects'} render={(rp) => <Projects {...props} {...rp}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(projects)