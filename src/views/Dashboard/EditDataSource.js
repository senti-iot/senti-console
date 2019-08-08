import React, { Component, Fragment } from "react";
import { Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItem, ListItemText, Divider, Collapse } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, DateFilterMenu, CircularLoader, SlideT } from 'components';
import { Close, PieChartRounded, DonutLargeRounded, BarChart, ShowChart, ExpandMore } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import withLocalization from 'components/Localization/T';
import { suggestionGen, filterItems } from 'variables/functions';
import Search from 'components/Search/Search';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS, unassignSensor } from 'redux/data';
import ESChart from './EditSources/Chart'
import ESGauge from './EditSources/Gauge';
import ESScorecard from './EditSources/Scorecard';

export class EditDataSource extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			dataSourceExp: false,
			generalExp: true,
			selectDevice: false,
			selectFunction: false,
			filters: {
				keyword: ''
			}
		}
	}
	componentWillUnmount = () => {
		this.props.unassignSensor()
	}
	componentDidUpdate = async (prevProps, prevState) => {

	}
	chartTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
			{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
		]
	}
	handleEditDataKey = e => {
		let newG = { ...this.props.g }
		newG.dataSource.dataKey = e.target.value
		this.props.editGraph(newG)
	}
	handleEditCF = d => () => {
		let newG = { ...this.props.g }
		newG.dataSource.cf = d
		this.props.editGraph(newG)
		this.setState({
			filters: {
				keyword: ''
			}
		})
		this.handleCloseF()
	}
	handleEditDeviceAB = (d, s) => () => {
		let newG = { ...this.props.g }
		// Object.assign(newG, this.props.g)
		newG.dataSources[s].deviceId = d
		// this.props.getSensor(d)
		this.props.editGraph(newG)
		this.setState({
			filters: {
				keyword: ''
			}
		})
		this.handleCloseD()
	}
	handleEditDevice = d => () => {
		let newG = { ...this.props.g }
		// Object.assign(newG, this.props.g)
		newG.dataSource.deviceId = d
		this.props.getSensor(d)
		this.props.editGraph(newG)
		this.setState({
			filters: {
				keyword: ''
			}
		})
		this.handleCloseD()
	}
	handleEditChartType = (e) => {
		let newG = { ...this.props.g }
		newG.period.chartType = e.target.value
		newG.chartType = e.target.value
		this.setState({ loading: true })
		this.props.editGraph(newG)
		this.setState({ loading: false })
	}
	handleEditPeriodG = (menuId, to, from, defaultT) => {
		let newG = { ...this.props.g }
		newG.period = {
			...newG.period,
			menuId: menuId,
			to: to,
			from: from,
			timeType: defaultT
		}
		newG.periodType = menuId
		this.props.editGraph(newG)
	}
	handleEditG = (prop) => e => {
		let newG = { ...this.props.g }
		newG[prop] = e.target.value
		this.props.editGraph(newG)
	}
	handleEditName = (prop) => e => {
		let newG = { ...this.props.g }
		newG.dataSources[prop].label = e.target.value
		this.props.editGraph(newG)
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleChangeDS = () => this.setState({ dataSourceExp: !this.state.dataSourceExp })
	handleChangeGeneral = () => this.setState({ generalExp: !this.state.generalExp })

	handleChangeDSa = () => this.setState({ dataSourceA: !this.state.dataSourceA })
	handleChangeDSb = () => this.setState({ dataSourceB: !this.state.dataSourceB })

	handleOpenD = () => this.setState({ selectDevice: true })
	handleOpenF = () => this.setState({ selectFunction: true })
	handleCloseD = () => this.setState({ selectDevice: false })
	handleCloseF = () => this.setState({ selectFunction: false })

	renderSelectFunction = () => {
		const { classes, t, cfs } = this.props
		const { selectFunction, filters } = this.state
		return <Dialog
			fullScreen
			open={selectFunction}
			onClose={this.handleCloseF}
			TransitionComponent={SlideT}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseF} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.cloudfunctions')}
								</T>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfs ? suggestionGen(cfs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.cloudfunctions')}
								</T>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfs ? suggestionGen(cfs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{cfs ? filterItems(cfs, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={this.handleEditCF(p.id)} value={p.id}>
							<ListItemText
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>
	}
	renderSelectDevice = () => {
		const { classes, t, sensors } = this.props
		const { selectDevice, filters } = this.state
		return <Dialog
			fullScreen
			open={selectDevice}
			onClose={this.handleCloseD}
			TransitionComponent={SlideT}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden smDown>
						<ItemG container alignItems={'center'}>
							<ItemG lg={2} md={4} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseD} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('devices.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={9} md={7}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden mdUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.handleCloseD} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('devices.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				<ListItem button onClick={this.handleEditDevice('all')} value={'all'}>
					<ListItemText primary={'All'} />
				</ListItem>
				{sensors ? filterItems(sensors, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={this.handleEditDevice(p.id)} value={p.id}>
							<ListItemText
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>
	}
	handleEditGraph = (newG) => {
		this.props.editGraph(newG)
	}
	render() {
		const { t, classes, sensor, g, cfs, getSensor } = this.props
		const { generalExp, dataSourceA, dataSourceB } = this.state
		switch (g.type) {
			case 0:
				return <ESChart
					handleEditGraph={this.handleEditGraph}
					getSensor={getSensor}
					t={t}
					classes={classes}
					sensor={sensor}
					g={g}
					cfs={cfs}
				/>
			case 1:
				return <ESGauge
					handleEditGraph={this.handleEditGraph}
					getSensor={getSensor}
					t={t}
					classes={classes}
					sensor={sensor}
					g={g}
					cfs={cfs}
				/>
			case 2:
				return <Fragment>
					<ItemG xs={12}>
						<ExpansionPanel
							expanded={generalExp}
							square
							onChange={this.handleChangeGeneral}
							classes={{
								root: classes.expansionPanel
							}}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
								<T>{`${t('dashboard.fields.general')}`}</T>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<ItemG container>
									<ItemG xs={12}>
										<TextF
											handleChange={this.handleEditG('name')}
											autoFocus
											id={'name'}
											label={t('dashboard.fields.label')}
											value={g.name}
											margin='normal'
										/>
									</ItemG>
								</ItemG>
							</ExpansionPanelDetails>

						</ExpansionPanel>

					</ItemG>
					<ItemG xs={12}>
						<ExpansionPanel
							expanded={dataSourceA}
							square
							onChange={this.handleChangeDSa}
							classes={{
								root: classes.expansionPanel
							}}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
								<T>{`${t('dashboard.fields.dataSource')}`}</T>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<ItemG container>
									<ItemG xs={12}>
										<DateFilterMenu
											customSetDate={this.handleEditPeriodG}
											label={t('dashboard.fields.defaultPeriod')}
											inputType
											t={t}
											period={g.period} />
									</ItemG>
									<ItemG xs={12}>
										{this.renderSelectDevice()}
										<TextF
											id={'sensorChart'}
											label={t('dashboard.fields.device')}
											value={sensor ? sensor.name : t('no.device')}
											handleClick={this.handleOpenD}
											handleChange={() => { }}
										/>
									</ItemG>
									<ItemG>
										<TextF
											id={'scbAB-a-name'}
											label={t('dashboard.fields.name')}
											value={g.dataSources.a.label}
											handleChange={this.handleEditName('a')}
										/>
									</ItemG>
									<Collapse unmountOnExit in={g.dataSources.a.deviceId > 0}>
										{g.dataSources.a.deviceId > 0 ?
											<Fragment>
												<ItemG>
													<DSelect
														simple
														value={g.dataSources.a.dataKey}
														onChange={this.handleEditDataKey}
														menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
													/>
												</ItemG>
												<ItemG>
													{this.renderSelectFunction()}
													<TextF
														id={'cfSelect'}
														label={t('dashboard.fields.cf')}
														value={cfs[cfs.findIndex(f => f.id === g.dataSources.a.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSources.a.cf)].name : t('no.function')}
														handleClick={this.handleOpenF}
														handleChange={() => { }}
													/>
												</ItemG>
												<ItemG xs={12}>
													<TextF
														handleChange={this.handleEditG('unit')}
														autoFocus
														id={'unit'}
														label={t('dashboard.fields.unit')}
														value={g.unit}
														margin='normal'
													/>
												</ItemG>
											</Fragment>
											: null}
									</Collapse>
								</ItemG>
							</ExpansionPanelDetails>

						</ExpansionPanel>
					</ItemG>
					<ItemG xs={12}>
						<ExpansionPanel
							expanded={dataSourceB}
							square
							onChange={this.handleChangeDSb}
							classes={{
								root: classes.expansionPanel
							}}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
								<T>{`${t('dashboard.fields.dataSource')}`}</T>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<ItemG container>
									<ItemG xs={12}>
										<DateFilterMenu
											customSetDate={this.handleEditPeriodG}
											label={t('dashboard.fields.defaultPeriod')}
											inputType
											t={t}
											period={g.period} />
									</ItemG>
									<ItemG xs={12}>
										{this.renderSelectDevice(this.handleEditDeviceAB, 'a')}
										<TextF
											id={'sensorChart'}
											label={t('dashboard.fields.device')}
											value={sensor ? sensor.name : t('no.device')}
											handleClick={this.handleOpenD}
											handleChange={() => { }}
										/>
									</ItemG>
									<ItemG>
										<TextF
											id={'scbAB-b-name'}
											label={t('dashboard.fields.name')}
											value={g.dataSources.b.label}
											handleChange={this.handleEditName('b')}
										/>
									</ItemG>
									<Collapse unmountOnExit in={g.dataSources.b.deviceId > 0}>
										{g.dataSources.b.deviceId > 0 ?
											<Fragment>
												<ItemG>
													<DSelect
														simple
														value={g.dataSources.b.dataKey}
														onChange={this.handleEditDataKey}
														menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
													/>
												</ItemG>
												<ItemG>
													{this.renderSelectFunction()}
													<TextF
														id={'cfSelect'}
														label={t('dashboard.fields.cf')}
														value={cfs[cfs.findIndex(f => f.id === g.dataSources.b.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSources.b.cf)].name : t('no.function')}
														handleClick={this.handleOpenF}
														handleChange={() => { }}
													/>
												</ItemG>
												<ItemG xs={12}>
													<TextF
														handleChange={this.handleEditG('unit')}
														autoFocus
														id={'unit'}
														label={t('dashboard.fields.unit')}
														value={g.unit}
														margin='normal'
													/>
												</ItemG>
											</Fragment>
											: null}
									</Collapse>
								</ItemG>
							</ExpansionPanelDetails>

						</ExpansionPanel>
					</ItemG>
				</Fragment>
			case 3:
				return <ESScorecard
					handleEditGraph={this.handleEditGraph}
					getSensor={getSensor}
					t={t}
					classes={classes}
					sensor={sensor}
					g={g}
					cfs={cfs}
				/>
			case 4:
				return <ItemG>
					WindCard
				</ItemG>
			default:
				break;
		}
	}
}
const mapStateToProps = (state, props) => ({
	g: state.dsSystem.eGraph,
	sensor: state.data.sensor,
	cfs: [...state.data.functions, { id: -1, name: props.t('no.cloudfunction') }],
	sensors: state.data.sensors
})

const mapDispatchToProps = dispatch => ({
	editGraph: (newG) => dispatch(editGraph(newG)),
	getSensor: async id => dispatch(await getSensorLS(id)),
	unassignSensor: () => dispatch(unassignSensor())
})

export default withLocalization()(connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(EditDataSource)))
