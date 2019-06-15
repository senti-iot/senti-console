import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, withStyles, ButtonBase, Slide } from '@material-ui/core';
import { ItemG, T, GridContainer, CircularLoader } from 'components';
import { Close } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { setDailyData } from 'components/Charts/DataModel';
import { teal } from '@material-ui/core/colors';
import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import logo from '../../logo.svg'
import { getDashboardData } from 'redux/dsSystem';

class DashboardPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDashboard: false
		}
	}
	componentDidMount = async () => {
		const { getDashboardData, d } = this.props
		await getDashboardData(d.id)
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
		const { t, classes, d, loading } = this.props
		const { openDashboard } = this.state
		const { handleCloseDashboard } = this
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		// let dataSet = {
		// 	name: 'Weekly',
		// 	data: data.weekly.data,
		// 	color: teal[500]
		// }
		// let dataSetACC = {
		// 	name: 'ACC',
		// 	data: data.meter.data,
		// 	color: teal[500]
		// }
		console.log('Loading', loading)
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
			{loading ? <CircularLoader /> : <div className={classes[d.color]} style={{ height: 'calc(100%)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
				<GridContainer style={{ padding: 16 }} spacing={16} justify={'center'} alignItems={'center'}
				>
					{d.graphs ? d.graphs.map((g, i) => {
						console.log(g.data)
						if (g.data)
							if (g.dataSource.type === 1)
								return <ItemG key={g.id} xs={12} md={6} container justify={'center'}>
									<GaugeFakeData
										title={g.name}
										period={{ ...g.period, menuId: g.periodType }}
										data={g.data}
										t={t}
										single
									/>
								</ItemG>
							else { 
								return <ItemG key={g.id} xs={12} md={6} container justify={'center'}>
									<DoubleChartFakeData
										title={g.name}
										single={true}
										period={{ ...g.period, menuId: 3, chartType: 3, timeType: 2 }}
										// value={data.myUsage.data}
										t={t}
										newState={setDailyData([{ data: g.data, name: g.name, color: teal[500], id: g.id }], g.period.from, g.period.to)}
									/>
								</ItemG>
							}
						return null
					}) : null}
				</GridContainer>
			</div>}
		</Dialog>
	}
	render() {
		const { d, data } = this.props
		console.log('D', d)
		return (
			<Fragment>
				{this.renderDashboard()}
				<ItemG xs={12} md={4} lg={3}>
					<DashboardCard
						handleOpenDashboard={this.handleOpenDashboard}
						data={data}
						header={d.name}
						img={imgs.data}
						content={d.description}
						c={d.color}
					/>
				</ItemG>
			</Fragment>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	loading: state.dsSystem.gotDashboardData
})

const mapDispatchToProps = (dispatch) => ({
	getDashboardData: async (id) => dispatch(await getDashboardData(id))
})

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(DashboardPanel))
