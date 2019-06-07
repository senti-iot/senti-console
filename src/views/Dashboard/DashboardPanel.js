import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, withStyles, Grid } from '@material-ui/core';
import { ItemG, T, GridContainer, /* DateFilterMenu, */  } from 'components';
import { Close } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { setDailyData } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';
import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';

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
	renderDashboard = () => {
		const { t, classes, data } = this.props
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
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.createDashboard')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.createDashboard')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<GridContainer style={{ height: '100%', background: '#eee', padding: 32 }} justify={'center'} alignItems={'center'}>
				{/* <Paper style={{ width: '70vw', height: '70vh', display: 'flex' }}> */}
				<Grid container spacing={16} justify={'center'} alignItems={'center'}>
					<ItemG xs={6} container justify={'center'}>
						{/* <div style={{ width: '30vw', height: '33vh', position: 'relative' }}> */}
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
					<ItemG xs={6} container justify={'center'}>
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
					<ItemG xs={6}>
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
					<ItemG xs={6}>
						<DoubleChartFakeData
							title={'Meter Reading'}
							single={true}
							period={{ ...data.myUsage.period, menuId: 3, chartType: 3, timeType: 2 }}
							value={data.myUsage.data}
							t={t}
							newState={setDailyData([dataSetACC], data.weekly.period.from, data.weekly.period.to)}
							sensor={{
								id: 30,
							}}
						/>
						{/* <MultiLineChart
							data={setDailyData([dataSetACC], data.weekly.period.from, data.weekly.period.to).lineDataSets}
							unit={{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' }}
							t={t}
							single={true}
						/> */}
					</ItemG>
				</Grid>
				{/* </Paper> */}
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
