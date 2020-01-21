import React from 'react'
import { Link } from 'react-router-dom'
import { Link as MuiLink } from '@material-ui/core'
export const SLink = (props) => <MuiLink component={Link} {...props}></MuiLink>
