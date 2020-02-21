import React from 'react'
import { Redirect } from 'react-router-dom'

const orgs = (props) => {
	return (
		<Redirect from={'/orgs'} to={`/management/orgs`} />
	)
}

export default orgs
