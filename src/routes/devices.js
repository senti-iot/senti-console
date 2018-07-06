import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Devices from 'views/Devices/Devices';
// import Projects from 'views/Projects/Projects';
// import CreateProject from 'components/Project/CreateProject';

export default withRouter((props) => {
	return (
		<Switch>
			{/* <Route path={'/devices/new'} component={() => <CreateProject setHeader={props.setHeader} />}/> */}
			<Route path={'/devices'} render={(rp) => <Devices setHeader={props.setHeader} {...rp} />} />
		</Switch>
	)
})
