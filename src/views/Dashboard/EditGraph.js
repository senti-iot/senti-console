import React, { Component } from "react";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Drawer } from '@material-ui/core';
import { T, ItemG } from 'components';
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


const ResponsiveReactGridLayout = WidthProvider(Responsive);

class EditGraph extends Component {
	typeChildren = (g) => {
		const { t } = this.props
		// const { d } = this.state
		let d = this.props.d
		// console.log('G Type', g.type, g.grid)
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
				return <Paper key={g.id} data-grid={g.grid}>

					<DoubleChartFakeData
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
				return <Paper key={g.id} data-grid={g.grid}>

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
				return <Paper key={g.id} data-grid={g.grid}>

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
				return <Paper key={g.id} data-grid={g.grid}>
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
			>	<AppBar className={classes.appBar + ' ' + appBarClasses}>
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
				<div style={{ width: '100%', height: 'calc(100% - 118px)', marginTop: '118px' }}>
				

					<ResponsiveReactGridLayout
						verticalCompact={false}
						{...this.props}
						style={{ minWidth: '600px' }}
					>
						{g ? this.typeChildren(g) : null}
					</ResponsiveReactGridLayout>
				</div>
				<Drawer
					variant={'permanent'}
					anchor={'right'}
					PaperProps={{
						style: {
							top: 70
						}
					}}
				>
					DataSources
				</Drawer>
			</Dialog>
		)
	}
}

const mapStateToProps = (state) => ({
	g: state.dsSystem.eGraph,
	cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
	className: "layout",
	rowHeight: 25,
	isDraggable: false,
	isResizable: false,
})

const mapDispatchToProps = () => ({
	
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(EditGraph)))
