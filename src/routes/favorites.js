import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Favorites from 'views/Favorites/Favorites';

const favorites = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}`}>
				<Favorites {...props} />
			</Route>
		</Switch>
	)
}

export default favorites