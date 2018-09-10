import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Users from 'views/Users/Users';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';

export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			{/* <Route path={'/projects/new'} component={() => <CreateProject t={props.t} setHeader={props.setHeader} />}/> */}
			<Route path={'/users'} render={(rp) => <Users setHeader={props.setHeader} t={props.t} {...rp}/>} />
		</Switch>
	)
}))
