import React, { Component, Fragment } from 'react'
import { getAllDevices } from '../../variables/dataDevices';
import { withStyles, Paper } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import { Maps } from 'components/Map/Maps';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map } from '@material-ui/icons'
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from '../../variables/functions';
import DeviceCard from 'components/Devices/DeviceCard'
// var moment = require('moment');

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: null,
			deviceHeaders: [],
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'id',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader("devices.pageTitle", false, '', "devices")
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterEndDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.getDevices()
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.devices)
		this.setState({ devices: newData, order, orderBy: property })
	}
	getDevices = async () => {
		const { t } = this.props
		await getAllDevices().then(rs => this._isMounted ? this.setState({
			devices: rs ? rs : [],
			deviceHeader: [
				{ id: "name", label: t("devices.fields.name") },
				{ id: "id", label: t("devices.fields.id") },
				{ id: "liveStatus", label: t("devices.fields.status") },
				{ id: "address", label: t("devices.fields.address") },
				{ id: "org.name", label: t("devices.fields.org") },
				{ id: "project.id", label: t("devices.fields.availability") }
			],
			loading: false
		}, () => this.handleRequestSort(null, "id", "asc")) : null)
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getDevices()
		// No more bullcrap
		// this.liveStatus = setInterval(this.getDevices, 10000);
		if (this.props.location.pathname.includes('/map'))
			this.setState({ route: 1 })
		else {
			if (this.props.location.pathname.includes('/grid'))
				this.setState({ route: 2 })
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			if (this.props.location.pathname.includes('/map'))
				this.setState({ route: 1 })
			else {
				if (this.props.location.pathname.includes('/grid'))
					this.setState({ route: 2 })
				else {
					this.setState({ route: 0 })
				}
			}
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearInterval(this.liveStatus)

		// this.liveStatus= null
	}

	componentWillUnmount = () => {
		window.clearInterval(this.liveStatus)
	}

	renderLoader = () => {
		// const { classes } = this.props

		return <CircularLoader />
	}
	renderList = () => {
		const { loading, order, orderBy } = this.state
		return loading ? this.renderLoader() : <GridContainer container justify={ 'center' } /* className={classes.grid} */>
			<DeviceTable
				t={this.props.t}
				data={this.filterItems(this.state.devices)}
				tableHead={this.state.deviceHeader}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleRequestSort={this.handleRequestSort}
				handleFilterStartDate={this.handleFilterStartDate}
				filters={this.state.filters}
				order={order}
				orderBy={orderBy}
				reload={this.reload}
			/>
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <GridContainer container justify={ 'center' }>
			{ this.filterItems(this.state.devices).map((d, k) => {
				return <DeviceCard key={k} t={ this.props.t } d={ d } />
			}) }
		</GridContainer>
	}
	renderMap = () => {
		const { devices, loading } = this.state
		const { classes } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={ 'center' } >
			<Paper className={ classes.paper }>
				<Maps t={ this.props.t } isMarkerShown centerDenmark markers={ this.filterItems(devices) } /* zoom={10} */ />
			</Paper>
		</GridContainer>
	}
	tabs = [
		{ id: 0, title: this.props.t("devices.tabs.listView"), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t("devices.tabs.mapView"), label: <Map />, url: `${this.props.match.path}/map` },
		{ id: 2, title: this.props.t("devices.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.path}/grid` },
	]
	render () {
		const { devices, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={ devices }
					filters={ filters }
					history={ this.props.history }
					match={ this.props.match }
					handleFilterKeyword={ this.handleFilterKeyword }
					tabs={ this.tabs }
				/>
				<Switch>
					<Route path={ `${this.props.match.path}/map` } render={ () => this.renderMap() } />
					<Route path={ `${this.props.match.path}/list` } render={ () => this.renderList() } />
					<Route path={ `${this.props.match.path}/grid` } render={ () => this.renderCards() } />
					<Redirect path={ `${this.props.match.path}` } to={ `${this.props.match.path}/list` } />
				</Switch>
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Devices)