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
		// eslint-disable-next-line no-dupe-keys
		background: '#90caf9',
		// eslint-disable-next-line no-dupe-keys
		background: '-moz-linear-gradient(left, #90caf9 0%, #42a5f5 20%, #26a69a 40%, #fdd835 60%, #f57c00 80%, #d32f2f 100%)',
		// eslint-disable-next-line no-dupe-keys
		background: '-webkit-linear-gradient(left, #90caf9 0%,#42a5f5 20%,#26a69a 40%,#fdd835 60%,#f57c00 80%,#d32f2f 100%)',
		// eslint-disable-next-line no-dupe-keys
		background: 'linear-gradient(to right, #90caf9 0%,#42a5f5 20%,#26a69a 40%,#fdd835 60%,#f57c00 80%,#d32f2f 100%)',
		filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#90caf9\', endColorstr=\'#d32f2f\',GradientType=1 )',
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
	to: state.dateTime.heatMap.to,
	from: state.dateTime.heatMap.from,
	timeType: state.dateTime.heatMap.timeType
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withLeaflet(withStyles(styles, { withTheme: true })(HeatMapLegend)))