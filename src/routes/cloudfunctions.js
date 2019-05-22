import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import CloudFunctions from 'views/Cloud/CloudFunctions';
// import CreateProject from 'components/Project/CreateProject';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import CreateCloudFunction from 'views/Cloud/CreateCloudFunction';

const functions = (props) => {
	return (
		<Switch>
			<Route path={'/functions/new'} component={(rp) => <CreateCloudFunction {...props} {...rp} />} />
			<Route path={'/functions'} render={(rp) => <CloudFunctions {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(functions)