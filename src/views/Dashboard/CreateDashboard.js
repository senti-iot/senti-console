import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper } from '@material-ui/core';
import { InfoCard } from 'components';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

//ignore
export default class CreateDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentBreakpoint: "lg",
			compactType: "vertical",
			mounted: false,
			layouts: { lg: [] }
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
					)}/>
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
			i: (newLg.length + 1).toString() })
		console.log(newLg)
		this.setState({
			layouts: { lg: newLg }
		})
	}
	render() {
		return (
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
		);
	}
}

CreateDashboard.propTypes = {
	onLayoutChange: PropTypes.func.isRequired
};

CreateDashboard.defaultProps = {
	className: "layout",
	rowHeight: 24,
	onLayoutChange: function () { },
	cols: { lg: 24, md: 10, sm: 6, xs: 4, xxs: 2 },
	// initialLayout: generateLayout()
};

