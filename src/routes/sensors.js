import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Sensors from 'views/Sensors/Sensors';
import CreateSensor from 'views/Sensors/CreateSensor';

const sensors = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateSensor {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Sensors {...props} />
			</Route>
		</Switch>
	)
}

export default sensors