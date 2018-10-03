import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Users from 'views/Users/Users';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import CreateUser from 'components/User/CreateUser';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';

const users = (props) => {
	return (
		<Switch>
			<Route path={'/users/new'} render={(rp) => <CreateUser {...props} {...rp}/>}/>
			<Route path={'/users'} render={(rp) => <Users {...props} {...rp}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(users)