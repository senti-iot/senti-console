import React from 'react'
import { Redirect } from 'react-router-dom'
// import Orgs from 'views/Orgs/Orgs';
// import withLocalization from 'components/Localization/T';
// import CreateOrg from 'components/Orgs/CreateOrg';
// import withSnackbar from 'components/Localization/S';
// import { compose } from 'recompose';

const orgs = (props) => {
	return (
		<Redirect from={props.match.path} to={`/management/orgs`}/>
		// <Switch>
		// 	<Route path={'/orgs/new'} component={(rp) => <CreateOrg {...props}  {...rp}/>}/>
		// 	<Route path={'/orgs'} render={(rp) => <Orgs {...props} {...rp}/>} />
		// </Switch>
	)
}

export default orgs
