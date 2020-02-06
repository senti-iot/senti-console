import React from "react"
import { Route, Switch } from "react-router-dom"
import Sensor from "views/Sensors/Sensor"
import EditSensor from "views/Sensors/EditSensor"

const sensor = props => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`}>
				<EditSensor {...props} />
			</Route>
			<Route path={`${props.match.url}`} >
				<Sensor {...props} />
			</Route>
		</Switch>
	)
}

export default sensor
