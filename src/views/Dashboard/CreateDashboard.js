import React from "react";
import PropTypes from "prop-types";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Toolbar, Hidden, withStyles, List, ListItem } from '@material-ui/core';
import { T, ItemG, CircularLoader } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import { useDrop, useDrag } from 'react-dnd'
import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import { createDash, createGraph } from 'redux/dsSystem';

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
	let background = 'linear-gradient(to bottom, #b5bdc8 0%,#828c95 36%,#28343b 100%)'
	if (isActive) {
		background = 'darkgreen'
	} else if (canDrop) {
		background = 'darkkhaki'
	}
	return (
		<div ref={drop} style={Object.assign({}, style, { background, width: '100%', height: '100%' })}>
			{children}
		</div>
	)
}
const boxStyle = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	float: 'left',
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
	const opacity = isDragging ? 0.4 : 1
	return (
		<div ref={drag} style={Object.assign({}, boxStyle, { opacity })}>
			{name}
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
			layout: { lg: props.gs.map((g) => ({
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
		console.log('CreateDashboar updated')
		console.log(prevProps.gs.length, this.props.gs.length)
		if (prevProps.gs.length !== this.props.gs.length) {
			console.log('updated')
			this.setState({
				layout: { lg: this.props.gs.map((g) => ({
					i: g.id,
					...g.grid
				})) 
				} 
			})
			
		}
	}
	
	typeChildren = (g) => {
		const { t } = this.props
		// const { d } = this.state
		let d = this.props.d
		console.log('G Type', g.type)
		switch (g.type) {
			case 1:
				return <Paper key={g.id} data-grid={g.grid}>
					<GaugeFakeData
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

	handleAddNew = () => {
		let newLg = this.state.layouts.lg
		newLg.unshift({
			x: 0,
			y: Infinity,
			w: 6,
			h: 4,
			i: (newLg.length + 1).toString()
		})
		this.setState({
			layouts: { lg: newLg }
		})
	}
	render() {
		const { openAddDash, handleCloseDT, classes, t, d  } = this.props
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
											{t('dashboard.createDashboard')}
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
											{t('dashboard.createDashboard')}
										</T>
									</ItemG>
								</ItemG>
							</Hidden>
						</Toolbar>
					</AppBar>
					<div style={{ width: '100vw', height: '100%' }}>

						<ItemG container>
							{/* <ItemG xs={2}> */}
							<Paper style={{ borderRadius: 0, background: '#ccc', width: '200px', position: 'fixed', height: 'calc(100vh - 84px)' }}>
								Toolbox
								<List>
									<ListItem>
										<Box type={"chart"} name={'test'}/>
									</ListItem>
								</List>
							</Paper>
							{/* </ItemG> */}
							<ItemG xs={12}>
								<div style={{ margin: 8, transform: 'scale(0.8)' }}>
									<Dustbin onDrop={item => this.props.createGraph(item.type)}>

										<ResponsiveReactGridLayout
											{...this.props}
											layouts={this.state.layout}
											onLayoutsChange={() => {}}
											measureBeforeMount={false}
											useCSSTransforms={this.state.mounted}
											compactType={this.state.compactType}
										>
											{this.generateDOM()}
										</ResponsiveReactGridLayout>
									</Dustbin>
								</div>
							</ItemG>
						</ItemG>
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
	cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
	onLayoutChange: () => { },
})

const mapDispatchToProps = dispatch => ({
	createDash: () => dispatch(createDash()),
	createGraph: (type) => dispatch(createGraph(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(CreateDashboard))