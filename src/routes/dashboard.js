import React from "react"
import { Route, Switch } from "react-router-dom"
import Dashboard from 'views/Dashboard/Dashboard'


const dashboard = props => {
	return (
		<Switch>
			<Route path={`${props.path}`}>
				<Dashboard {...props} />
			</Route>
		</Switch>
	)
}

export default dashboard
