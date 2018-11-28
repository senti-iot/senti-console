import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Collections from 'views/Collections/Collections';
import CreateCollection from 'views/Collections/CreateCollection';

const collections = (props) => {
	return (
		<Switch>
			<Route path={'/collections/new'} component={() => <CreateCollection {...props}/>}/>
			<Route path={'/collections'} render={() => <Collections {...props}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(collections)