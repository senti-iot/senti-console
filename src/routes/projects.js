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
			<Route path={'/projects/new'} component={(rp) => <CreateProject t={props.t} setHeader={props.setHeader} {...rp}/>}/>
			<Route path={'/projects'} render={(rp) => <Projects setHeader={props.setHeader} t={props.t} {...rp}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(projects)