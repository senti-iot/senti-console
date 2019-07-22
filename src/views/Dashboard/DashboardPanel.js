import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, withStyles, ButtonBase, Slide, Paper } from '@material-ui/core';
import { ItemG, T, CircularLoader } from 'components';
import { Close } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import logo from '../../logo.svg'
import ScorecardAB from 'views/Charts/ScorecardAB';
import Scorecard from 'views/Charts/Scorecard';
import WindCard from 'views/Charts/WindCard';
import { Responsive, WidthProvider } from "react-grid-layout";
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme } from 'variables/themes';
import { graphType } from 'variables/dsSystem/graphTypes';
import { removeDashboard } from 'redux/dsSystem';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class DashboardPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDashboard: false,
			initialLayout: props.initialLayout
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
	renderPos = (l) => {
		return <div style={{ position: 'absolute',
			top: '50%',
			left: '50%',
			zIndex: '9999',
			background: 'white',
			fontSize: '24px',
			padding: '20px',
			transformOrigin: 'center',
			transform: 'translate(-50%, -50%)', backgroundColor: "#000" }}>
			[{l.x}, {l.y}, {l.w}, {l.h}]
		</div>
	}
	componentDidMount() {
		this.setState({
			initialLayout: this.props.initialLayout
		})
	}
	
	onLayoutChange = (args) => {
		this.setState({
			initialLayout: {
				lg: args
			}
		})
	}
	gridCoords = (type) => {
		switch (type) {
			case 0:
				return 'chart'
			case 1: 
				return 'gauge'
			case 2:
				return 'scorecardAB'
			case 3:
				return 'scorecard'
			case 4:
				return 'windcard'
			default:
				break;
		}
	}
	renderDashboard = () => {
		const { t, classes, d, loading } = this.props
		const { openDashboard } = this.state
		const { handleCloseDashboard } = this
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDashboard}
			onClose={handleCloseDashboard}
			TransitionComponent={this.transition}>
			<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
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
				<ResponsiveReactGridLayout
					{...this.props}
					onBreakpointChange={this.onBreakpointChange}
					onLayoutChange={this.onLayoutChange}
					measureBeforeMount={false}
					useCSSTransforms={this.state.mounted}
				>
					{d.graphs.map((g, i) => {
						let grid = g.grid ? g.grid : graphType(this.gridCoords(g.type)).grid
						switch (g.type) {
							case 1:
								return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
									{/* {this.renderPos(grid)} */}
									<GaugeSData
										title={g.name}
										period={{ ...g.period, menuId: g.periodType }}
										t={t}
										color={d.color}
										gId={g.id}
										dId={d.id}
										single
									/>
								</Paper>
							case 0:
								return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
									{/* {this.renderPos(grid)} */}
									<DoubleChart
										title={g.name}
										g={g}
										period={{ ...g.period }}
										gId={g.id}
										dId={d.id}
										color={d.color}
										single={true}
										t={t}
									/>
								</Paper>
							case 2:
								return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
									{/* {this.renderPos(grid)} */}
									<ScorecardAB
										color={d.color}
										title={g.name}
										gId={g.id}
										dId={d.id}
										single={true}
										t={t}
									/>
								</Paper>
							case 3:
								return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
									{/* {this.renderPos(grid)} */}
									<Scorecard
										color={d.color}
										title={g.name}
										gId={g.id}
										dId={d.id}
										single={true}
										t={t}
									/>
								</Paper>
							case 4:
								return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
									{/* {this.renderPos(grid)} */}
									<WindCard
										title={g.name}
										gId={g.id}
										dId={d.id}
										single={true}
										t={t}
									/>
								</Paper>
							default:
								return null;
						}
		
					})}
				</ResponsiveReactGridLayout>
			</div>}
		</Dialog>
	}
	render() {
		const { d, data, t } = this.props
		return (
			<Fragment>
				<ThemeProvider theme={darkTheme}>
					{this.renderDashboard()}
				</ThemeProvider>
				<ItemG xs={12} md={4} lg={3} xl={2}>
					<DashboardCard
						deleteDashboard={() => this.props.removeDashboard(d.id)}
						handleOpenDashboard={this.handleOpenDashboard}
						data={data}
						header={d.name}
						img={imgs.data}
						content={d.description}
						c={d.color}
						t={t}
					/>
				</ItemG>
			</Fragment>
		)
	}
}
DashboardPanel.defaultProps = {
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
	onLayoutChange: () => { },
	cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
};
const mapStateToProps = (state, ownProps) => ({
	// loading: state.dsSystem.gotDashboardData
})

const mapDispatchToProps = (dispatch) => ({
	removeDashboard: (id) => dispatch(removeDashboard(id))
})

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(DashboardPanel))
