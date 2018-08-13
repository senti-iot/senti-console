import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Projects from 'views/Projects/Projects';
import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';

export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			<Route path={'/projects/new'} component={() => <CreateProject setHeader={props.setHeader} />}/>
			<Route path={'/projects'} render={(rp) => <Projects setHeader={props.setHeader} {...rp}/>} />
		</Switch>
	)
}))
