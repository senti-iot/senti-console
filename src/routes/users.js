import React from 'react'
import { Redirect } from 'react-router-dom'

const users = (props) => {
	return (
		<Redirect from={props.match.path} to={`/management/users`}/>
	)
}

export default users