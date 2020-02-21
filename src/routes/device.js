
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Device from 'views/Devices/Device';
import CalibrateDevice from 'views/Devices/CalibrateDevice';
import EditDeviceDetails from 'components/Devices/EditDeviceDetails';
import ResetDevice from 'views/Devices/ResetDevice';
import EditDeviceHardware from 'components/Devices/EditDeviceHardware';

const device = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit-hardware`}>
				<EditDeviceHardware {...props} />
			</Route>
			<Route path={`${props.path}/setup`}>
				<CalibrateDevice {...props} />
			</Route>
			<Route path={`${props.path}/edit`}>
				<EditDeviceDetails {...props} />
			</Route>
			<Route path={`${props.path}/reset`}>
				<ResetDevice {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Device {...props} />
			</Route>
		</Switch>
	)
}

export default device