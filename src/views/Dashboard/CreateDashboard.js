import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Button } from '@material-ui/core';
import { T, ItemG, CircularLoader, Dropdown, TextF } from 'components';
import cx from 'classnames'
import { Close, Edit, Clear, Palette } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { createDash, createGraph, editGraphPos, setGE, removeGE } from 'redux/dsSystem';
import CreateDashboardToolbar from 'components/Toolbar/CreateDashboardToolbar';
import EditGraph from './EditGraph';
import { red } from '@material-ui/core/colors';
import ToolbarItem from './ToolbarItem';
import DropZone from './DropZone';
import { weekendColorsDropdown } from 'variables/functions';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
//ignore
class CreateDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			graphs: [],
			currentBreakpoint: "lg",
			compactType: 'vertical',
			mounted: false,
			openEditGraph: false,
			openToolbox: true,
			layout: {
				lg: props.gs.map((g) => ({
					i: g.id,
					...g.grid
				}))
			}
		};
	}

	componentDidMount = () => {
		this.props.createDash()
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.gs !== this.props.gs) {
			this.setState({
				layout: {
					lg: this.props.gs.map((g) => ({
						i: g.id,
						...g.grid
					}))
				}
			})

		}
	}
	editGraphOpen = l => e => {
		this.props.setGE(l)
		this.setState({ openEditGraph: true })
	}
	removeGraph = l => e => {
		this.props.removeGE(l)
	}
	renderPos = (l) => {
		const { classes } = this.props
		return <div className={classes.editGraph}>
			<ItemG>
				<Button style={{ margin: 4 }} variant={'contained'} color={'primary'} onClick={this.editGraphOpen(l)}>
					<Edit style={{ marginRight: 8 }} />Edit
				</Button>
			</ItemG>
			<ItemG>
				<Button variant={'contained'} style={{ margin: 4, background: red[600], color: '#fff' }} onClick={this.removeGraph(l)}>
					<Clear style={{ marginRight: 8 }} /> Remove
				</Button>
			</ItemG>
		</div>
	}
	typeChildren = (g, i) => {
		const { t } = this.props
		// const { d } = this.state
		let d = this.props.d
		// console.log('G Type', g.type, g.grid)
		switch (g.type) {
			case 1:
				return <Paper key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
					<GaugeSData
						create
						title={g.name}
						period={g.period}
						t={t}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single
					/>
				</Paper>
			case 0:
				return <Paper key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
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
				return <Paper key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
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
					{this.renderPos(g.grid)}
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
					{this.renderPos(g.grid)}
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
	generateDOM = () => {
		const gs = this.props.gs
		return gs.map((g, i) => this.typeChildren(g, i))
	}
	editGraphPos = (layout, oldItem, ng, placeholder, e, element) => {
		this.setState({ updated: true })
		this.props.editGraphPos({
			h: ng.h,
			i: ng.i,
			minH: ng.minH,
			minW: ng.minW,
			w: ng.w,
			x: ng.x,
			y: ng.y,
		})
		this.setState({ updated: false })
	}
	changeWeekendColor = (value) => {
		console.log(value)
	}
	renderColorPicker = () => {
		const { t } = this.props
		return <Dropdown 
			icon={<Palette style={{ color: "#FFF" }}/>}
			menuItems={weekendColorsDropdown(t)}
			onChange={this.changeWeekendColor}
		/>
	}
	render() {
		const { openAddDash, handleCloseDT, classes, d, t } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});

		return (
			!d ? <CircularLoader /> :
				<Dialog
					fullScreen
					open={openAddDash}
					onClose={handleCloseDT}
					TransitionComponent={this.transition}
					PaperProps={{
						className: classes[d.color]
					}}
				>
					<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
						<Toolbar>
							<Hidden mdDown>
								<ItemG container alignItems={'center'}>
									<ItemG xs={2} container alignItems={'center'}>
										<IconButton color='inherit' onClick={handleCloseDT} aria-label='Close'>
											<Close />
										</IconButton>
									</ItemG>
									<ItemG container xs={10} justify={'center'} alignItems={'center'}>
									
										<TextF 
											InputProps={{
												style: {
													color: '#fff'
												}
											}}
											reversed
											label={t('dashboards.fields.name')}
										/>
										{this.renderColorPicker()}
										
									</ItemG>
								</ItemG>
							</Hidden>
							<Hidden lgUp>
								<ItemG container alignItems={'center'}>
									<ItemG xs={4} container alignItems={'center'}>
										<IconButton color={'inherit'} onClick={handleCloseDT} aria-label='Close'>
											<Close />
										</IconButton>
										<T variant='h6' color='inherit' className={classes.flex}>
											{this.state.n}
										</T>
									</ItemG>
								</ItemG>
							</Hidden>
						</Toolbar>
					</AppBar>
					<CreateDashboardToolbar
						content={
							<ItemG container style={{ flexWrap: this.state.n === 'sm' || this.state.n === 'xxs' ? 0 : 1 }}>
								<ToolbarItem type={"chart"} name={'Chart'} />
								<ToolbarItem type={"gauge"} name={'Gauge'} />
								<ToolbarItem type={"scorecard"} name={'Scorecard'} />
								<ToolbarItem type={"scorecardAB"} name={'Difference Scorecard'} />
								<ToolbarItem type={"windcard"} name={'Windcard'} />
							</ItemG>

						}>
					</CreateDashboardToolbar>
					{this.state.openEditGraph ?
						<EditGraph d={this.props.d} g={this.props.eGraph} handleCloseEG={() => { this.setState({ openEditGraph: false }); this.forceUpdate() }} openEditGraph={this.state.openEditGraph} />
						: null}
					<div style={{ width: '100%', height: 'calc(100% - 118px)' }}>
						<DropZone color={d.color} onDrop={item => { console.log(item); this.props.createGraph(item.type) }}>
							<ResponsiveReactGridLayout
								{...this.props}
								onBreakpointChange={(n) => this.setState({ n })}
								onDragStop={this.editGraphPos}
								onResizeStop={this.editGraphPos}
								measureBeforeMount={false}
								onLayoutChange={() => {}}
								useCSSTransforms={true}
							>
								{this.generateDOM()}
							</ResponsiveReactGridLayout>
						</DropZone>
					</div>
				</Dialog>
		);
	}
}


const mapStateToProps = (state) => ({
	d: state.dsSystem.cDash,
	gs: state.dsSystem.cGraphs,
	eGraph: state.dsSystem.eGraph,
	cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
})

const mapDispatchToProps = dispatch => ({
	createDash: () => dispatch(createDash()),
	createGraph: (type) => dispatch(createGraph(type)),
	editGraphPos: (g) => dispatch(editGraphPos(g)),
	setGE: g => dispatch(setGE(g)),
	removeGE: g => dispatch(removeGE(g))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(CreateDashboard))