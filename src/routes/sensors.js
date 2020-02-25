import React from 'react'
import { Switch, Route } from 'react-router-dom'

const AsyncCreateSensor = React.lazy(() => import('views/Sensors/CreateSensor'))
const AsyncSensors = React.lazy(() => import('views/Sensors/Sensors'))

const sensors = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<AsyncCreateSensor {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<AsyncSensors {...props} />
			</Route>
		</Switch>
	)
}

export default sensors