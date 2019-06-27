import React, { Component } from "react";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Drawer } from '@material-ui/core';
import { T, ItemG, CircularLoader } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import withLocalization from 'components/Localization/T';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS } from 'redux/data';
import EditDataSource from './EditDataSource';
// import { useWidth } from 'components/WidthProvider/Width';
// import { useWidth } from 'components/WidthProvider/Width';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// function withWidth(Component) {
// 	return function WrappedComponent(props) {
// 	  const width = useWidth();
// 	  return <Component {...props} width={width} />;
// 	}
// }
class EditGraph extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}
	}
	// componentDidUpdate(prevProps, prevState) {
	// 	console.log(this.state.layout)
	// }
	
	// renderPos = (l) => {
	// 	return <div style={{ position: 'absolute',
	// 		top: '50%',
	// 		left: '50%',
	// 		zIndex: '9999',
	// 		background: 'white',
	// 		fontSize: '24px',
	// 		padding: '20px',
	// 		transformOrigin: 'center',
	// 		transform: 'translate(-50%, -50%)' }}>
	// 		[{l.x}, {l.y}, {l.w}, {l.h}]
	// 	</div>
	// }
	typeChildren = (g) => {
		const { t } = this.props
		let d = this.props.d
		// console.log(g.grid)
		if (g)
			switch (g.type) {
				case 1:
					return <Paper key={g.id} data-grid={this.getCoords(g.grid)}>
						<GaugeFakeData
							create
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
					return <Paper key={g.id} data-grid={this.getCoords(g.grid)}>
						<DoubleChart
							create
							title={g.name}
							gId={g.id}
							dId={d.id}
							color={d.color}
							single={true}
							t={t}
						/>
					</Paper>
				case 2:
					return <Paper key={g.id} data-grid={this.getCoords(g.grid)}>

						<ScorecardAB
							create
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 3:
					return <Paper key={g.id} data-grid={this.getCoords(g.grid)}>

						<Scorecard
							create
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 4:
					return <Paper key={g.id} data-grid={this.getCoords(g.grid)}>
						<WindCard
							create
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
		else {
			return null
		}
	}
	getCoords = (c) => {
		let coords = { ...c }
		coords.x = 0
		coords.y = 0
		return coords
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	render() {
		const { openEditGraph, handleCloseEG, classes, g, t } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (
			<Dialog
				fullScreen
				open={openEditGraph}
				onClose={handleCloseEG}
				TransitionComponent={this.transition}
			>	<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={2} container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCloseEG} aria-label='Close'>
										<Close />
									</IconButton>
								</ItemG>
								<ItemG xs={10}>
									<T variant='h6' color='inherit' className={classes.flex}>
										{t('dashboard.editGraph')}
									</T>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={4} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={handleCloseEG} aria-label='Close'>
										<Close />
									</IconButton>
									<T variant='h6' color='inherit' className={classes.flex}>
										{t('dashboard.editGraph')}
									</T>
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<div style={{ width: '100%', height: 'calc(100% - 70px)', background: '#eee' }}>
					{this.state.loading ? <CircularLoader /> :
						<ResponsiveReactGridLayout
							compactType={null}
							{...this.props}
							onLayoutChange={layout => this.setState({ layout })}
							// style={{ width: '100%', height: '100%', minWidth: '600px' }}
						>
							{this.typeChildren(g)}
						</ResponsiveReactGridLayout>
					}
				</div>
				<Drawer
					variant={'permanent'}
					anchor={'right'}
					PaperProps={{
						style: {
							width: 360,
							top: 70,
						}
					}}
				>
					<ItemG container justify={'center'}>
						{g ? <EditDataSource /> : null}
					</ItemG>
				</Drawer>
			</Dialog>
		)
	}
}

const mapStateToProps = (state) => ({
	cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
	className: "layout",
	// verticalCompact: false,
	rowHeight: 25,
	isDraggable: true,
	isResizable: false,
	cfs: state.data.functions,
	sensors: state.data.sensors
})

const mapDispatchToProps = dispatch => ({
	editGraph: (newG) => dispatch(editGraph(newG)),
	getSensor: async id => dispatch(await getSensorLS(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle, { withTheme: true })(EditGraph)))
