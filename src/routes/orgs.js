import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Orgs from 'views/Orgs/Orgs';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import CreateOrg from 'components/Orgs/CreateOrg';

export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			<Route path={'/orgs/new'} component={(rp) => <CreateOrg t={props.t} setHeader={props.setHeader}  {...rp}/>}/>
			<Route path={'/orgs'} render={(rp) => <Orgs setHeader={props.setHeader} t={props.t} {...rp}/>} />
		</Switch>
	)
}))
