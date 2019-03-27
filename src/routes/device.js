
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import Device from 'views/Devices/Device';
import CalibrateDevice from 'views/Devices/CalibrateDevice';
import EditDeviceDetails from 'components/Devices/EditDeviceDetails';
import ResetDevice from 'views/Devices/ResetDevice';
import EditDeviceHardware from 'components/Devices/EditDeviceHardware';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';

const device = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit-hardware`} render={() => <EditDeviceHardware {...props} />} />
			<Route path={`${props.match.url}/setup`} render={() => <CalibrateDevice {...props} />} />
			<Route path={`${props.match.url}/edit`} render={() => <EditDeviceDetails {...props} />} />
			<Route path={`${props.match.url}/reset`} render={() => <ResetDevice {...props}/>}/>
			<Route path={`${props.match.url}`} render={() => <Device {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(device)