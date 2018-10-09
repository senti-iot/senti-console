import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Devices from 'views/Devices/Devices';
// import Projects from 'views/Projects/Projects';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';

const devices = (props) => {
	return (
		<Switch>
			{/* <Route path={'/devices/new'} component={() => <CreateProject setHeader={props.setHeader} />}/> */}
			<Route path={'/devices'} render={(rp) => <Devices setHeader={props.setHeader} t={props.t} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(devices)