import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, Paper, withStyles, Grid } from '@material-ui/core';
import { ItemG, T, GridContainer, DateFilterMenu, MultiLineChart } from 'components';
import { Close } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import Gauge from 'components/Charts/Gauge';
import { setDailyData } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';

class DashboardPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDashboard: true
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
		console.log(setDailyData([dataSet], data.weekly.period.from, data.weekly.period.to).lineDataSets)
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
			<GridContainer style={{ height: '100%', background: '#eee' }} justify={'center'} alignItems={'center'}>
				<Paper style={{ width: '70vw', height: '70vh', display: 'flex' }}>
					<Grid container spacing={8} justify={'center'} alignItems={'center'}>
						<ItemG>

							<div style={{ width: '30vw', height: '33vh', position: 'relative' }}>
								<Gauge
									period={data.myUsage.period}
									value={data.myUsage.data}
									title={'My Usage'}
								/>
								<div style={{ position: "absolute", top: 0, right: 0 }}>
									<DateFilterMenu t={t} />
								</div>
							</div>
						</ItemG>
						<ItemG>
							<div style={{ width: '30vw', height: '33vh', position: 'relative' }}>
								<Gauge
									period={data.otherUsage.period}
									value={data.otherUsage.data}
									title={'Other people\'s usage'}
								/>
								<div style={{ position: "absolute", top: 0, right: 0 }}>
									<DateFilterMenu t={t} />
								</div>
							</div>
						</ItemG>
						<ItemG>
							<div style={{ width: '34vw', height: '33vh' }}>
								<MultiLineChart
									data={setDailyData([dataSet], data.weekly.period.from, data.weekly.period.to).lineDataSets}
									unit={{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' }}
									t={t}
									single={true}
								/>
							</div>
						</ItemG>
						<ItemG>
							<div style={{ width: '34vw', height: '33vh' }}>
								<MultiLineChart
									data={setDailyData([dataSetACC], data.weekly.period.from, data.weekly.period.to).lineDataSets}
									unit={{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' }}
									t={t}
									single={true}
								/>
							</div>
						</ItemG>
					</Grid>
				</Paper>
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
