import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, MuiThemeProvider, Paper } from '@material-ui/core';
import moment from 'moment'
import { ItemG } from 'components';
import { connect } from 'react-redux'

const styles = theme => ({
	fullscreenButton: {
		background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		color: theme.palette.type !== 'dark' ? 'inherit' : "#fff",
		padding: 4,
		borderRadius: 4,
	},
	fullscreenOn: {
		width: '100%!important',
		height: '100%!important'
	},
	gradientBar: {
		width: 250,
		height: 20,
		background: "rgb(255,255,255)",
		// eslint-disable-next-line no-dupe-keys
		background: "-moz-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%, rgba(144, 202, 249, 1) 10%, rgba(66, 165, 245, 1) 20%, rgba(38, 166, 154, 1) 40%, rgba(253, 216, 53, 1) 60%, rgba(245, 124, 0, 1) 80%, rgba(211, 47, 47, 1) 100%)",
		// eslint-disable-next-line no-dupe-keys
		background: "-webkit - linear - gradient(left, rgba(255, 255, 255, 1) 0 %, rgba(255, 255, 255, 1) 0 %, rgba(144, 202, 249, 1) 10 %, rgba(66, 165, 245, 1) 20 %, rgba(38, 166, 154, 1) 40 %, rgba(253, 216, 53, 1) 60 %, rgba(245, 124, 0, 1) 80 %, rgba(211, 47, 47, 1) 100 %)",
		// eslint-disable-next-line no-dupe-keys
		background: "linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 0%,rgba(144,202,249,1) 10%,rgba(66,165,245,1) 20%,rgba(38,166,154,1) 40%,rgba(253,216,53,1) 60%,rgba(245,124,0,1) 80%,rgba(211,47,47,1) 100%)",
		filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#ffffff", endColorstr="#d32f2f",GradientType=1 )'
	},
	pseudoFullscreen: {
		position: "fixed!important",
		width: "100%!important",
		height: "100%!important",
		top: "0!important",
		left: "0!important",
		zIndex: 99999,
	}
})
class HeatMapLegend extends MapControl {

	constructor(props, context) {
		super(props)
		this.map = context.map || this.props.leaflet.map;
		this.container = L.DomUtil.create('div', 'leaflet-control-heatbar leaflet-bar');
	}
	defaultValue = 25
	setMaxValue = (half) => { 
		const { to, from, timeType } = this.props
		let max = 0
		switch (timeType) {
			case 0:
				max = this.defaultValue
				break
			case 1:
				max = this.defaultValue * 60
				break
			case 2:
				max = this.defaultValue * 1440 * moment(to).diff(from, 'days')
				break
			default:
				break
		}
		console.log(max)
		return this.numberWithCommas(half ? max / 2 : max)

	}
	componentDidMount() {
		super.componentDidMount();
	}
	componentDidUpdate() { 
		this.leafletElement.remove()
		this.leafletElement.addTo(this.map)
	}
	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
	
	createLeafletElement(props) {
		const HeatMapLegend = Control.extend({
			options: {
				position: this.props.position || 'bottomleft',
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<Paper classes={{ root: this.props.classes.fullscreenButton }}>
							<div className={this.props.classes.gradientBar} />
							<ItemG container justify={'space-between'}>
								<ItemG xs={4} style={{ textAlign: 'left' }}>0</ItemG>
								<ItemG xs={4} style={{ textAlign: 'center' }}>{this.setMaxValue(true)}</ItemG>
								<ItemG xs={4} style={{ textAlign: 'right' }}>{this.setMaxValue(false)}+</ItemG>
							</ItemG>
						</Paper>

					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new HeatMapLegend(props)
	}
	updateLeafletElement = (props) => {
		HeatMapLegend = Control.extend({
			options: {
				position: this.props.position || 'bottomleft',
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<Paper classes={{ root: this.props.classes.fullscreenButton }}>
							<div className={this.props.classes.gradientBar} />
							<ItemG container justify={'space-between'}>
								<div style={{ width: 40 }}>0</div>
								<div style={{ width: 40 }}>{this.setMaxValue(true)}</div>
								<div style={{ width: 40 }}>{this.setMaxValue(false)}+</div>
							</ItemG>
						</Paper>

					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new HeatMapLegend(props)
	}
}
const mapStateToProps = (state) => ({
	to: state.dateTime.periods[0].to,
	from: state.dateTime.periods[0].from,
	timeType: state.dateTime.periods[0].timeType
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLeaflet(withStyles(styles, { withTheme: true })(HeatMapLegend)))