
import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import Collection from 'views/Collections/Collection';
import EditDeviceType from 'views/DeviceTypes/EditDeviceType';
import DeviceType from 'views/DeviceTypes/DeviceType';

const deviceType = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`} >
				<EditDeviceType {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<DeviceType {...props} />
			</Route>
		</Switch>
	)
}

export default deviceType