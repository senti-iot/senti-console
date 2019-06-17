
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
// import Collection from 'views/Collections/Collection';
import EditDeviceType from 'views/DeviceTypes/EditDeviceType';
import DeviceType from 'views/DeviceTypes/DeviceType';

const registry = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditDeviceType {...props} />}/>
			<Route path={`${props.match.url}`} render={() => <DeviceType {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(registry)