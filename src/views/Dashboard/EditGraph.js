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
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import withLocalization from 'components/Localization/T';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS } from 'redux/data';
import EditDataSource from './EditDataSource';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class EditGraph extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}
	}

	typeChildren = (g) => {
		const { t } = this.props
		let d = this.props.d
		if (g)
			switch (g.type) {
				case 1:
					return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
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
					return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
						<DoubleChartFakeData
							create
							title={g.name}
							// g={g}
							// period={g.period}
							// period={{ ...g.period, menuId: g.periodType }}
							gId={g.id}
							dId={d.id}
							color={d.color}
							single={true}
							t={t}
						/>
					</Paper>
				case 2:
					return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>

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
					return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>

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
					return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
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
	// chartTypes = (p) => {
	// 	const { t } = this.props
	// 	return [
	// 		{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
	// 		{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
	// 		{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
	// 		{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
	// 	]
	// }
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	render() {
		const { openEditGraph, handleCloseEG, classes, g } = this.props
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
										{/* {this.state.n} */}
										Edit Graph
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
										Edit Graph
									</T>
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<div style={{ width: '100%', height: 'calc(100% - 70px)', background: '#eee' }}>
					{this.state.loading ? <CircularLoader /> : 
						<ResponsiveReactGridLayout
							{...this.props}
							style={{ minWidth: '600px', }}
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
	rowHeight: 25,
	isDraggable: false,
	isResizable: false,

	cfs: state.data.functions,
	sensors: state.data.sensors
})

const mapDispatchToProps = dispatch => ({
	editGraph: (newG) => dispatch(editGraph(newG)),
	getSensor: async id => dispatch(await getSensorLS(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(EditGraph)))
