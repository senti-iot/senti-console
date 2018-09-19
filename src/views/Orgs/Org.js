import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles/* , Typography, Grid, Hidden */ } from '@material-ui/core';
import { getOrg } from 'variables/dataUsers';
import { OrgDetails } from './OrgCards/OrgDetails';
// var moment = require("moment")

class User extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			loading: true
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
	  if (prevProps.match.params.id !== this.props.match.params.id)
	  {
			this.componentDidMount()
	  }
	}
	
	componentDidMount = () => {
		if (this.props.match)
			if (this.props.match.params.id) {
				this.timer = setTimeout(async () => await getOrg(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(`${rs.name}`, true, '/users/orgs')
						this.setState({ org: rs, loading: false })
					}
				}))
			}
	}

	render() {
		const { classes, t, history } = this.props
		const { org, loading } = this.state
		return (
			loading ? <CircularLoader /> : <Fragment>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin>
						<OrgDetails history={history} classes={classes} t={t} org={org}/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
					
					</ItemGrid>
				</GridContainer>
			</Fragment>
		)
	}
}

export default withStyles(userStyles)(User)
