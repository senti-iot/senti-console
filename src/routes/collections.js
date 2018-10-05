import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Collections from '../views/Collections/Collections';

const collections = (props) => {
	return (
		<Switch>
			{/* <Route path={'/devices/new'} component={() => <CreateProject setHeader={props.setHeader} />}/> */}
			<Route path={'/collections'} render={(rp) => <Collections setHeader={props.setHeader} t={props.t} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(collections)