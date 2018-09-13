import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { UserContact } from './UserCards/UserContact';
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
	componentDidMount = () => {
		if (this.props.match)
			if (this.props.match.params.id)
			{
				this.timer = setTimeout(async () => await getUser(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(`${rs.firstName} ${rs.lastName}`, true, '/users')
						this.setState({ user: rs, loading: false })
					}
				}))
				  }
	}
	
	render() {
		const { classes, t } = this.props
		const { user, loading } = this.state
		return (
			loading ? <CircularLoader /> : <Fragment>
				{/* <div className={classes.root}>
					<Grid container justify={"center"} alignItems={"center"} style={{ padding: 10, height: "100%" }}>
						<Hidden mdUp>
							<ItemGrid xs={12} alignContent={"center"} justify={"center"} container>
								<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
							</ItemGrid>
							<ItemGrid xs={12} container alignItems={"center"} justify={"center"}>
								<Typography variant={"display2"} className={classes.textColor}>
								
								</Typography>
							</ItemGrid>

						</Hidden>
						<Hidden smDown>
							<ItemGrid xs container alignItems={"center"} justify={"center"}>
								<Typography variant={"display3"} className={classes.textColor}>
									{user.firstName + " " + user.lastName}
								</Typography>
							</ItemGrid>
							<ItemGrid xs={3} alignContent={"center"} container>
								<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
							</ItemGrid>
						</Hidden>
					</Grid>
				</div> */}
				<GridContainer justify={'center'} alignContent={'space-between'}>
				
					<ItemGrid xs={12} noMargin>
						<UserContact t={t} user={user} classes={classes}/>
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
