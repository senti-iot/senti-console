import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Favorites from 'views/Favorites/Favorites';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';

const favorites = (props) => {
	return (
		<Switch>
			<Route path={'/favorites'} render={(rp) => <Favorites {...props}/>} />
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(favorites)