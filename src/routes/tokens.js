import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Tokens from 'views/API/Tokens';

const messages = (props) => {
	return (
		<Switch>
			<Route path={'/api'} render={(rp) => <Tokens {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(messages)