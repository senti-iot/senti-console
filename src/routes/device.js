
import React from 'react';
import { /* Route, */ Switch, withRouter } from 'react-router-dom';


export default withRouter((props) => {
	return (
		<Switch>
			{/* <Route path={`${props.match.url}/edit`} render={() => <CreateProject {...props} />} />
			<Route path={`${props.match.url}`} render={() => <Project {...props} />} /> */}
		</Switch>
	)
})