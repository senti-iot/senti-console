import React, { Component } from "react";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Drawer, Slide } from '@material-ui/core';
import { T, ItemG, CircularLoader } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import withLocalization from 'components/Localization/T';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS } from 'redux/data';
import EditDataSource from './EditDataSource';
import MapData from 'views/Charts/MapData';
import MultiSourceChart from 'views/Charts/MultiSourceChart';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class EditGraph extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}
		this.cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }
	}

	typeChildren = (g) => {
		const { t } = this.props
		let d = this.props.d
		if (g)
			switch (g.type) {
				case 1:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>
						<GaugeSData
							create
							chartId={'editor' + g.id}
							color={d.color}
							title={g.name}
							period={{ ...g.period, menuId: g.periodType }}
							t={t}
							gId={g.id}
							dId={d.id}
							single
						/>
					</Paper>
				case 0:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>
						<DoubleChart
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
						/>
					</Paper>
				case 2:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>

						<ScorecardAB
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 3:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>

						<Scorecard
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 4:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>
						<WindCard
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 5:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>
						<MapData
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
							t={t}
						/>
					</Paper>
				case 6:
					return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={this.getCoords(g.grid)}>
						<MultiSourceChart
							create
							color={d.color}
							title={g.name}
							gId={g.id}
							dId={d.id}
							single={true}
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
		const { openEditGraph, handleCloseEG, classes, g, t, d } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (
			<Dialog
				fullScreen
				open={openEditGraph}
				onClose={handleCloseEG}
				keepMounted
				TransitionComponent={Transition}
			>	<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={1} container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCloseEG} aria-label='Close'>
										<Close />
									</IconButton>
								</ItemG>
								<ItemG xs={10} container justify={'center'}>
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
				<div className={classes[d.color]} style={{ width: '100%', height: 'calc(100% - 70px)' }}>
					{this.state.loading ? <CircularLoader /> :
						<ResponsiveReactGridLayout
							compactType={null}
							cols={this.cols}
							className={"layout"}
							rowHeight={25}
							isDraggable={false}
							isResizable={false}
						// onLayoutChange={layout => this.setState({ layout })}
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
						classes: { root: classes.editSourceDrawer }
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
	cfs: state.data.functions,
	sensors: state.data.sensors
})

const mapDispatchToProps = dispatch => ({
	editGraph: (newG) => dispatch(editGraph(newG)),
	getSensor: async id => dispatch(await getSensorLS(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle, { withTheme: true })(EditGraph)))
