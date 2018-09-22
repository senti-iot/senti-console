import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles/* , Typography, Grid, Hidden */ } from '@material-ui/core';
import { getOrg } from 'variables/dataUsers';
import OrgDetails from './OrgCards/OrgDetails';
// var moment = require("moment")
import { connect } from 'react-redux'

class Org extends Component {
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
						this.props.setHeader(`${rs.name}`, true, '/orgs')
						this.setState({ org: rs, loading: false })
					}
				}))
			}
	}
	
	render() {
		const { classes, t, history, match, language } = this.props
		const { org, loading } = this.state
		return (
			loading ? <CircularLoader /> : <Fragment>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin>
						<OrgDetails match={match} history={history} classes={classes} t={t} org={org} language={language}/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
					
					</ItemGrid>
				</GridContainer>
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language
})

const mapDispatchToProps = {
  
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(userStyles)(Org))
