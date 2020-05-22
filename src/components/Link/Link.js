import React from 'react'
import { Link as RLink } from 'react-router-dom'
import { Link as MuiLink } from '@material-ui/core'

const Link = (props) => {
	return (
		<MuiLink component={props.href ? 'a' : RLink} {...props} />
	)
}

export default Link