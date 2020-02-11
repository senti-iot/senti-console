import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CreateDeviceType from 'views/DeviceTypes/CreateDeviceType'
import DeviceTypes from 'views/DeviceTypes/DeviceTypes'

const deviceTypes = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/new`}>
				<CreateDeviceType {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<DeviceTypes {...props} />
			</Route>
		</Switch>
	)
}

export default deviceTypes