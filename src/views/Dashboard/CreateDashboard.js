import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Toolbar, Hidden, withStyles, List, ListItem } from '@material-ui/core';
import { T, ItemG, InfoCard, ItemGrid } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';

import { useDrop, useDrag } from 'react-dnd'

const style = {
	height: '100%',
	width: '100%',
	transition: 'background 100ms ease'
}
const Dustbin = ({ i, children, onDrop }) => {
	const [{ canDrop, isOver }, drop] = useDrop({
		accept: ItemTypes.BOX,
		drop: (item) => onDrop({ item, i: i }),
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	})
	const isActive = canDrop && isOver
	let backgroundColor = 'inherit'
	if (isActive) {
		backgroundColor = 'darkgreen'
	} else if (canDrop) {
		backgroundColor = 'darkkhaki'
	}
	return (
		<div ref={drop} style={Object.assign({}, style, { backgroundColor })}>
			{isActive ? 'Release to drop' : null}
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
const Box = ({ name, insertChild }) => {
	const [{ isDragging }, drag] = useDrag({
		item: { name, type: ItemTypes.BOX },
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

const ItemTypes = {
	BOX: 'box',
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);
//ignore
class CreateDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentBreakpoint: "lg",
			compactType: 'vertical',
			mounted: false,
			layouts: props.initialLayout
		};
	}

	componentDidMount = () => {
		this.setState({ mounted: true });
	}

	generateDOM = () => {
		return this.state.layouts.lg.map((l, i) => {
			return (<Paper key={i} data-grid={l}>
				<Dustbin i={l.i} onDrop={item => this.insertChild(item)} children={l.children}/>
			</Paper>)
		})
	}
	insertChild = (type) => {
		let newLg = this.state.layouts.lg
		let index = newLg.findIndex(f => f.i === type.i)
		newLg[index].children = [<InfoCard
			noExpand
			title={'Test'}
			content={<ItemGrid container noMargin>
				<ItemG xs={12}>
					<T>This is a demo</T>
				</ItemG>
			</ItemGrid>}/>]
		this.setState({
			initialLayout: {
				lg: newLg
			}
		})
	}
	onBreakpointChange = (breakpoint) => {
		this.setState({
			currentBreakpoint: breakpoint
		});
	}

	onCompactTypeChange = () => {
		const { compactType: oldCompactType } = this.state;
		const compactType =
			oldCompactType === "horizontal"
				? "vertical"
				: oldCompactType === "vertical"
					? null
					: "horizontal";
		this.setState({ compactType });
	}

	onLayoutChange = (layout, layouts) => {
		this.props.onLayoutChange(layout, layouts);
	}

	onNewLayout = () => {
		this.setState({
			// layouts: { lg: generateLayout() }
		});
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
		const { openAddDash, handleCloseDT, classes, t } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});

		return (
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
						<ItemG xs={2}>
							<Paper style={{ borderRadius: 0, background: '#ccc', width: '100%', height: 'calc(100vh - 84px)' }}>
								Toolbox
								<List>
									<ListItem>
										<Box name={'test'}/>
									</ListItem>
								</List>
							</Paper>
						</ItemG>
						<ItemG xs={10}>
							<div style={{ margin: 8 }}>

								<div>
									Current Breakpoint: {this.state.currentBreakpoint} ({
										this.props.cols[this.state.currentBreakpoint]
									}{" "}
									columns)
								</div>
								<div>
									Compaction type:{" "}
									{_.capitalize(this.state.compactType) || "No Compaction"}
								</div>
								<button onClick={this.handleAddNew}>Add new Column</button>
								<button onClick={this.onNewLayout}>Generate New Layout</button>
								<button onClick={this.onCompactTypeChange}>
									Change Compaction Type
								</button>
								<ResponsiveReactGridLayout
									{...this.props}
									layouts={this.state.layouts}
									onBreakpointChange={this.onBreakpointChange}
									onLayoutChange={this.onLayoutChange}
									// WidthProvider option
									measureBeforeMount={false}
									// I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
									// and set `measureBeforeMount={true}`.
									useCSSTransforms={this.state.mounted}
									compactType={this.state.compactType}
								// preventCollision={!this.state.compactType}
								>
									{this.generateDOM()}
								</ResponsiveReactGridLayout>
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

CreateDashboard.defaultProps = {
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
	// autoSize: false,
	// isResizable: false,
	onLayoutChange: () => { },
	cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
	initialLayout: {

		lg: [{
			i: '0',
			x: 0,
			y: 0,
			h: 12,
			w: 4
		},
		{
			i: '1',
			x: 4,
			y: 0,
			h: 4,
			w: 3
		},
		{
			i: '2',
			x: 4,
			y: 7,
			h: 4,
			w: 3
		},
		{
			i: '3',
			x: 4,
			y: 14,
			h: 4,
			w: 3
		},
		{
			i: '4',
			x: 7,
			y: 0,
			h: 6,
			w: 4
		},
		{
			i: '5',
			x: 7,
			y: 6,
			h: 6,
			w: 4
		}, ]
	}
};

export default withStyles(dashboardStyle)(CreateDashboard)
// export default withStyles(dashboardStyle)(CreateDashboard)