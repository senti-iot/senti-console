import React from 'react'
import { Redirect } from 'react-router-dom'

const orgs = (props) => {
	return (
		<Redirect from={props.match.path} to={`/management/orgs`}/>
	)
}

export default orgs
