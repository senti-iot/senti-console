import React from "react"
import { Route, Switch } from "react-router-dom"
import Sensor from "views/Sensors/Sensor"
import SensorEvents from "views/Sensors/SensorEvents"
import EditSensor from "views/Sensors/EditSensor"

const sensor = props => {
	return (
		<Switch>
			<Route path={`${props.path}/events`}>
				<SensorEvents {...props} />
			</Route>
			<Route path={`${props.path}/edit`}>
				<EditSensor {...props} />
			</Route>
			<Route path={`${props.path}`} >
				<Sensor {...props} />
			</Route>
		</Switch>
	)
}

export default sensor
