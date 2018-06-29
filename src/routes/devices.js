import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Devices from 'views/Devices/Devices';
// import Projects from 'views/Projects/Projects';
// import CreateProject from 'components/Project/CreateProject';

export default withRouter((props) => {
	// console.log(process.env.REACT_APP_SENTI_MAPSKEY)
	return (
		<Switch>
			{/* <Route path={'/devices/new'} component={() => <CreateProject setHeader={props.setHeader} />}/> */}
			<Route path={'/devices'} render={() => <Devices setHeader={props.setHeader}/>} /> 
		</Switch>
	)
})
