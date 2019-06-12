import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Toolbar, Hidden, withStyles } from '@material-ui/core';
import { InfoCard } from 'components';
import { T, ItemG } from 'components';
import cx from 'classnames'
import { Close } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

//ignore
class CreateDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentBreakpoint: "lg",
			compactType: null,
			mounted: false,
			layouts: props.initialLayout
		};

		this.onBreakpointChange = this.onBreakpointChange.bind(this);
		this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
		this.onLayoutChange = this.onLayoutChange.bind(this);
		this.onNewLayout = this.onNewLayout.bind(this);
	}

	componentDidMount() {
		this.setState({ mounted: true });
	}

	generateDOM() {
		return _.map(this.state.layouts.lg, function (l, i) {
			console.log(l)
			return (<Paper key={i} data-grid={l}>
				<InfoCard
					noExpand
					key={i}
					title={i}
					content={(
						<span className="text">{i}</span>
					)} />
			</Paper>
			);
		});
	}

	onBreakpointChange(breakpoint) {
		this.setState({
			currentBreakpoint: breakpoint
		});
	}

	onCompactTypeChange() {
		const { compactType: oldCompactType } = this.state;
		const compactType =
			oldCompactType === "horizontal"
				? "vertical"
				: oldCompactType === "vertical"
					? null
					: "horizontal";
		this.setState({ compactType });
	}

	onLayoutChange(layout, layouts) {
		this.props.onLayoutChange(layout, layouts);
	}

	onNewLayout() {
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
		console.log(newLg)
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
				<div>

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
						preventCollision={!this.state.compactType}
					>
						{this.generateDOM()}
					</ResponsiveReactGridLayout>
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
	rowHeight: 21,
	onLayoutChange: function () { },
	cols: { lg: 21, md: 10, sm: 6, xs: 4, xxs: 2 },
	initialLayout: {

		lg: [{
			i: '0',
			x: 0,
			y: 0,
			h: 21,
			w: 6
		},
		{
			i: '1',
			x: 6,
			y: 0,
			h: 7,
			w: 4
		},
		{
			i: '2',
			x: 6,
			y: 7,
			h: 7,
			w: 4
		},
		{
			i: '3',
			x: 6,
			y: 14,
			h: 7,
			w: 4
		},		
		{
			i: '4',
			x: 10,
			y: 0,
			h: 11,
			w: 11
		},		
		{
			i: '5',
			x: 10,
			y: 11,
			h: 10,
			w: 11
		}, ]
	}
};

export default withStyles(dashboardStyle)(CreateDashboard)