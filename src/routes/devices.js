import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Devices from 'views/Devices/Devices';

const devices = (props) => {
	return (
		<Switch>
			<Route path={'/devices'}>
				<Devices {...props} />
			</Route>
		</Switch>
	)
}

export default devices