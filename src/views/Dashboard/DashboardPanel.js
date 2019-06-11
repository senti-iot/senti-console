import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, withStyles, ButtonBase, Slide } from '@material-ui/core';
import { ItemG, T, GridContainer, /* DateFilterMenu, */  } from 'components';
import { Close } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { setDailyData } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';
import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import logo from '../../logo.svg'

class DashboardPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDashboard: false
		}
	}
	handleOpenDashboard = () => {
		this.setState({
			openDashboard: true
		})
	}
	handleCloseDashboard = () => {
		this.setState({
			openDashboard: false
		})
	}
	transition(props) {
		return <Slide direction='up' {...props} />;
	}
	renderDashboard = () => {
		const { t, classes, data, d } = this.props
		const { openDashboard } = this.state
		const { handleCloseDashboard } = this
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		let dataSet = {
			name: 'Weekly',
			data: data.weekly.data,
			color: teal[500]
		}
		let dataSetACC = {
			name: 'ACC',
			data: data.meter.data,
			color: teal[500]
		}

		return <Dialog
			fullScreen
			open={openDashboard}
			onClose={handleCloseDashboard}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={1}>
								<div className={classes.logo}>
									<ButtonBase
										focusRipple
										className={classes.image}
										focusVisibleClassName={classes.focusVisible}
										style={{
											width: '120px'
										}}
									>
										<span
											className={classes.imageSrc}
											style={{
												backgroundImage: `url(${logo})`
											}}
										/>
									</ButtonBase>
								</div>
							</ItemG>
							<ItemG xs={10} container alignItems={'center'} justify={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color='inherit' onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={11} container alignItems={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color={'inherit'} onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>

							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<GridContainer style={{ padding: 16, height: 'calc(100% - 84px)' }} spacing={16} justify={'center'} alignItems={'center'}
				className={classes[d.color]}
			>
				{/* <Paper style={{ width: '70vw', height: '70vh', display: 'flex' }}> */}
				{/* <Grid container spacing={16} justify={'center'} alignItems={'center'}> */}
				<ItemG xs={12} md={6} container justify={'center'}>
					<GaugeFakeData
						title={'My usage'}
						period={{ ...data.myUsage.period, menuId: 3, chartType: 3 }}
						value={data.myUsage.data}
						t={t}
						sensor={{
							id: 30,
						}}
						single
					/>
				</ItemG>
				<ItemG xs={12} md={6} container justify={'center'}>
					<GaugeFakeData
						title={'Other Usage'}
						period={{ ...data.myUsage.period, menuId: 3, chartType: 3 }}
						value={data.otherUsage.data}
						t={t}
						sensor={{
							id: 30,
						}}
						single={true}
					/>
				</ItemG>
				<ItemG xs={12} md={6}>
					<DoubleChartFakeData
						title={'Weekly Usage'}
						single={true}
						period={{ ...data.myUsage.period, menuId: 3, chartType: 3, timeType: 2 }}
						value={data.myUsage.data}
						t={t}
						newState={setDailyData([dataSet], data.weekly.period.from, data.weekly.period.to)}
						sensor={{
							id: 30,
						}}
					/>

				</ItemG>
				<ItemG xs={12} md={6}>
					<DoubleChartFakeData
						title={'Meter Reading'}
						single={true}
						// color={d.color}
						period={{ ...data.myUsage.period, menuId: 3, chartType: 3, timeType: 2 }}
						value={data.myUsage.data}
						t={t}
						newState={setDailyData([dataSetACC], data.weekly.period.from, data.weekly.period.to)}
						sensor={{
							id: 30,
						}}
					/>
				
				</ItemG>
			</GridContainer>
		</Dialog>
	}
	render() {
		const { d, data } = this.props
		return (
			<Fragment>
				{this.renderDashboard()}
				<DashboardCard
					handleOpenDashboard={this.handleOpenDashboard}
					data={data}
					header={d.name}
					img={imgs.data}
					content={d.description}
					c={d.color}
				/>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	data: state.appState.dashboardData[0]
})

const mapDispatchToProps = () => ({

})

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(DashboardPanel))
