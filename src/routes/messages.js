import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Messages from 'views/Messages/Messages';

const messages = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}`}>
				<Messages {...props} />
			</Route>
		</Switch>
	)
}

export default messages