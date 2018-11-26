
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Collection from 'views/Collections/Collection';
import EditCollection from 'views/Collections/EditCollection';

const collection = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditCollection {...props} />}/>
			<Route path={`${props.match.url}`} render={() => <Collection {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(collection)