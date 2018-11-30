import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Holiday from 'views/Holidays/Holiday';

const holiday = (props) => {
	return (
		<Switch>
			<Route path={'/holiday'} render={(rp) => <Holiday {...props}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(holiday)