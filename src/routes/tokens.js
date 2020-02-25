import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Tokens from 'views/API/Tokens';

const messages = (props) => {
	return (
		<Switch>
			<Route path={'/api'}>
				<Tokens {...props} />
			</Route>
		</Switch>
	)
}

export default messages