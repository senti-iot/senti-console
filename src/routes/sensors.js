import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Sensors from 'views/Sensors/Sensors';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
// import CreateRegistry from 'views/Registries/CreateRegistry';

const registries = (props) => {
	return (
		<Switch>
			{/* <Route path={'/registries/new'} component={(rp) => < {...props} {...rp} />} /> */}
			{/* <Route path={'/registries/new'} component={(rp) => <CreateRegistry {...props} {...rp} />} /> */}
			{/* <Route path={'/projects/new'} component={(rp) => <CreateProject {...props} {...rp}/>}/> */}
			<Route path={'/sensors'} render={(rp) => <Sensors {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(registries)