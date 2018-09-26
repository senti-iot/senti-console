import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import UserContact from './UserCards/UserContact';
import { UserLog } from './UserCards/UserLog';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles/* , Typography, Grid, Hidden */ } from '@material-ui/core';
import { getUser } from 'variables/dataUsers';
// var moment = require("moment")

class User extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
			user: null,
			loading: true
	  }
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match && this.props.match.params)
			if (prevProps.match.params.id !== this.props.match.params.id)
			  	{this.setState({ loading: true })
				this.componentDidMount()}
	}
	
	componentDidMount = () => {
		if (this.props.match)
			if (this.props.match.params.id)
			{
				this.timer = setTimeout(async () => await getUser(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(`${rs.firstName} ${rs.lastName}`, true, '/users', "users")
						this.setState({ user: rs, loading: false })
					}
				}))
				  }
	}
	
	render() {
		const { classes, t } = this.props
		const { user, loading } = this.state
		const rp = { history: this.props.history, match: this.props.match }
		return (
			loading ? <CircularLoader /> : <Fragment>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin>
						<UserContact t={t} user={user} classes={classes} {...rp}/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<UserLog t={t} user={user}/>	
					</ItemGrid>
				</GridContainer>
			</Fragment>
		)
	}
}

export default withStyles(userStyles)(User)
