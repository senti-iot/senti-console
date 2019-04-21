import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Registries from 'views/Registries/Registries';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import CreateRegistry from 'views/Registries/CreateRegistry';

const registries = (props) => {
	return (
		<Switch>
			<Route path={'/registries/new'} component={(rp) => <CreateRegistry {...props} {...rp} />} />
			{/* <Route path={'/registries/new'} component={(rp) => <CreateRegistry {...props} {...rp} />} /> */}
			{/* <Route path={'/projects/new'} component={(rp) => <CreateProject {...props} {...rp}/>}/> */}
			<Route path={'/registries'} render={(rp) => <Registries {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(registries)