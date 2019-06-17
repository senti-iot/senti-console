import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Messages from 'views/Messages/Messages';

const messages = (props) => {
	return (
		<Switch>
			<Route path={'/messages'} render={(rp) => <Messages {...props} {...rp} />} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(messages)