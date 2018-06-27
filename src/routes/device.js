
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import Device from 'views/Devices/Device';
import CalibrateDevice from 'views/Devices/CalibrateDevice';


export default withRouter((props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit-hardware`} render={() => <div>Not Implemented - Edit Hardware</div>} />
			<Route path={`${props.match.url}/setup`} render={() => <CalibrateDevice {...props} />} />
			<Route path={`${props.match.url}/edit`} render={() => <div>Not Implemented</div>}/>
			<Route path={`${props.match.url}`} render={() => <Device {...props} />} /> 
		</Switch>
	)
})