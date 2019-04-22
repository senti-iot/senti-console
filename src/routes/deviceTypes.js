import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import CreateDeviceType from 'views/DeviceTypes/CreateDeviceType'
import DeviceTypes from 'views/DeviceTypes/DeviceTypes'

const registries = (props) => {
	return (
		<Switch>
			<Route path={'/devicetypes/new'} component={(rp) => <CreateDeviceType {...props} {...rp} />} />
			{/* <Route path={'/registries/new'} component={(rp) => <CreateRegistry {...props} {...rp} />} /> */}
			{/* <Route path={'/projects/new'} component={(rp) => <CreateProject {...props} {...rp}/>}/> */}
			<Route path={'/devicetypes'} render={(rp) => <DeviceTypes {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(registries)