import { Button, withStyles } from '@material-ui/core';
import imgs from 'assets/img/Squared';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { Caption, ItemG } from 'components';
import MediaCard from 'components/Cards/MediaCard';
import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DiscoverSenti from 'views/Dashboard/DiscoverSenti';
import pj from '../../../package.json';
// const Skycons = require('skycons')(window)

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0
		}
		props.setHeader('Senti.Cloud', false, '', 'dashboard')
	}


	componentDidMount = async () => {
		this.props.setHeader('Senti.Cloud', false, '', 'dashboard')
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleChange = (value) => {
		this.setState({ value })
	}

	handleChangeIndex = index => {
		this.setState({ value: index })
	}
	
	renderAction = (text, loc, right) => {
		const { t, /* history */ } = this.props
		return <Button size={'small'} color={'primary'} component={Link} to={loc} style={right ? { marginLeft: 'auto' } : null}>{t(text)}</Button>
	}

	render() {
		const { discoverSenti, t, history } = this.props
		return (
			<Fragment>
				{discoverSenti ? <DiscoverSenti t={t} history={history}/> : null}
				<GridContainer spacing={8} justify={'center'}>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}><MediaCard
						img={imgs.hosting}
						header={t('dashboard.cardHeaders.onSiteSetup')}
						content={t('dashboard.cardContent.onSiteSetup')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/devices', true)}
					/></ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}><MediaCard
						img={imgs.storage}
						header={t('dashboard.cardHeaders.projects')}
						content={t('dashboard.cardContent.projects')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/projects', true)}
					/></ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}><MediaCard
						img={imgs.devices}
						header={t('dashboard.cardHeaders.devices')}
						content={t('dashboard.cardContent.devices')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/devices', true)}
					/></ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}><MediaCard
						img={imgs.data}
						header={t('dashboard.cardHeaders.data')}
						content={t('dashboard.cardContent.data')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/collections/list', true)}
					/></ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}>	<MediaCard
						img={imgs.users}
						header={t('dashboard.cardHeaders.users')}
						content={t('dashboard.cardContent.users')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/management/users', true)}
					/></ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}>	<MediaCard
						img={imgs.settings}
						header={t('dashboard.cardHeaders.settings')}
						content={t('dashboard.cardContent.settings')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/settings', true)}
					/></ItemG>
					{/* <ItemG container justify={'center'} sm={6} md={4}>	<MediaCard
						img={imgs.notifications}
						header={t('dashboard.cardHeaders.notifications')}
						content={t('dashboard.cardContent.notifications')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/settings', true)}
					/></ItemG> */}
					{/* <ItemG container justify={'center'} sm={6} md={4}>	<MediaCard
						img={imgs.predictions}
						header={t('dashboard.cardHeaders.alerts')}
						content={t('dashboard.cardContent.alerts')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/settings', true)}
					/></ItemG> */}
					{/* <ItemG container justify={'center'} sm={6} md={4}>	<MediaCard
						img={imgs.sharing}
						header={t('dashboard.cardHeaders.api')}
						content={t('dashboard.cardContent.api')}
						leftAction={this.renderAction('actions.learnMore', '/')}
						rightAction={this.renderAction('actions.startNow', '/', true)}
					/></ItemG> */}
					<ItemG container justify={'center'} xs={12}>
						<Caption>
							Beta Senti.Cloud version {pj.version}
						</Caption>
					</ItemG>
				</GridContainer>
			</Fragment>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
	discoverSenti: state.settings.discSentiVal
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))