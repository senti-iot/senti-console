import React from "react";
import PropTypes from "prop-types";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Button } from '@material-ui/core';
import { T, ItemG, CircularLoader } from 'components';
import cx from 'classnames'
import { Close, Edit, Clear } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import { useDrop, useDrag } from 'react-dnd'
import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { createDash, createGraph, editGraphPos, setGE, removeGE } from 'redux/dsSystem';
import CreateDashboardToolbar from 'components/Toolbar/CreateDashboardToolbar';
import EditGraph from './EditGraph';
import { red } from '@material-ui/core/colors';

const style = {
	height: '100%',
	width: '100%',
	transition: 'background 100ms ease'
}
const Dustbin = ({ i, children, onDrop }) => {
	const [{ canDrop, isOver }, drop] = useDrop({
		accept: ItemTypes,
		drop: (item) => onDrop(item),
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	})
	const isActive = canDrop && isOver
	// let background = 'linear-gradient(to bottom, #b5bdc8 0%,#828c95 36%,#28343b 100%)'
	let background = 'inherit'
	if (isActive) {
		background = '#eee'
	} else if (canDrop) {
		// background = 'darkkhaki'
	}
	return (
		<div ref={drop} style={Object.assign({}, style, { background, width: '100%', height: '100%', overflow: 'auto' })}>
			{children}
		</div>
	)
}

const Box = ({ name, type }) => {
	const [{ isDragging }, drag] = useDrag({
		item: { name, type: type },
		end: dropResult => {
			if (dropResult) {
			}
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})
	
	return (
		<div ref={drag} style={{ margin: '0px 4px', opacity: isDragging ? 0.4 : 1, transition: 'all 300ms ease', cursor: 'move' }}>
			<Paper style={{ padding: '8px' }}>
				<T style={{ textAlign: 'center' }}>
					{name}
				</T>
			</Paper>
		</div>
	)
}

const ItemTypes = [
	"chart", "gauge", "scorecardAB", "scorecard", "windcard"
]

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
		if (prevProps.gs.length !== this.props.gs.length) {
			console.log('changing layout')
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
					<Edit style={{ marginRight: 8 }}/>Edit
				</Button>
			</ItemG>
			<ItemG>
				<Button variant={'contained'} style={{ margin: 4, background: red[600], color: '#fff' }} onClick={this.removeGraph(l)}>
					<Clear style={{ marginRight: 8 }}/> Remove
				</Button>
			</ItemG>
		</div>
	}
	typeChildren = (g) => {
		const { t } = this.props
		// const { d } = this.state
		let d = this.props.d
		// console.log('G Type', g.type, g.grid)
		switch (g.type) {
			case 1:
				return <Paper key={g.id} data-grid={g.grid}>
					{this.renderPos(g.grid)}
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
					{this.renderPos(g.grid)}
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
		return gs.map((g, i) => this.typeChildren(g))
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
	render() {
		const { openAddDash, handleCloseDT, classes, /* t,  */d } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});

		return (
			!d ? <CircularLoader /> :
				<Dialog
					fullScreen
					open={openAddDash}
					onClose={handleCloseDT}
					TransitionComponent={this.transition}>
					<AppBar className={classes.appBar + ' ' + appBarClasses}>
						<Toolbar>
							<Hidden mdDown>
								<ItemG container alignItems={'center'}>
									<ItemG xs={2} container alignItems={'center'}>
										<IconButton color='inherit' onClick={handleCloseDT} aria-label='Close'>
											<Close />
										</IconButton>
									</ItemG>
									<ItemG xs={10}>
										<T variant='h6' color='inherit' className={classes.flex}>
											{this.state.n}
										</T>
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
								<Box type={"chart"} name={'Chart'} />
								<Box type={"gauge"} name={'Gauge'} />
								<Box type={"scorecard"} name={'Scorecard'} />
								<Box type={"scorecardAB"} name={'Difference Scorecard'} />
								<Box type={"windcard"} name={'Windcard'} />
							</ItemG>

						}>
					</CreateDashboardToolbar>
					<EditGraph d={this.props.d} handleCloseEG={() => {this.setState({ openEditGraph: false })}} openEditGraph={this.state.openEditGraph}/>
					<div style={{ width: '100%', height: 'calc(100% - 118px)', marginTop: '118px' }}>
						<Dustbin onDrop={item => this.props.createGraph(item.type)}>
							<ResponsiveReactGridLayout
								{...this.props}
								onBreakpointChange={(n) => this.setState({ n })}
								onDragStop={this.editGraphPos}
								onResizeStop={this.editGraphPos}
								measureBeforeMount={false}
								useCSSTransforms={true}
								compactType={this.state.compactType}
							>
								{this.generateDOM()}
							</ResponsiveReactGridLayout>
						</Dustbin>
					</div>
				</Dialog>
		);
	}
}

CreateDashboard.propTypes = {
	onLayoutChange: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	d: state.dsSystem.cDash,
	gs: state.dsSystem.cGraphs,
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