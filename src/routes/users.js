import React from 'react'
import { /* Switch, Route, withRouter, */ Redirect } from 'react-router-dom'
// import Users from 'views/Users/Users';
// import CreateProject from 'components/Project/CreateProject';
// import withLocalization from 'components/Localization/T';
// import CreateUser from 'components/User/CreateUser';
// import withSnackbar from 'components/Localization/S';
// import { compose } from 'recompose';

const users = (props) => {
	return (
		<Redirect from={props.match.path} to={`/management/users`}/>
	)
}

export default users