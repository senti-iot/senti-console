
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
// import Collection from 'views/Collections/Collection';
import EditCloudFunction from 'views/Cloud/EditCloudFunction';
import CloudFunction from 'views/Cloud/CloudFunction';

const cloudfunction = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditCloudFunction {...props} />}/>
			<Route path={`${props.match.url}`} render={() => <CloudFunction {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(cloudfunction)