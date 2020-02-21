
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import User from 'views/Users/User';
import EditUser from 'components/User/EditUser';


const user = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`}>
				<EditUser {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<User {...props} />
			</Route>
		</Switch>
	)
}

export default user