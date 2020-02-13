import React, { useState, useEffect, Fragment } from "react";
import { Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItem, ListItemText, Divider, Collapse } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, DateFilterMenu, CircularLoader, SlideT } from 'components';
import { Close, /* PieChartRounded, DonutLargeRounded, BarChart, ShowChart, */ ExpandMore } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { useSelector, useDispatch } from 'react-redux'

// import withLocalization from 'components/Localization/T';
import { suggestionGen, filterItems } from 'variables/functions';
import Search from 'components/Search/Search';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS, unassignSensor, getDeviceTypeLS } from 'redux/data';
import ESChart from './EditSources/Chart'
import ESGauge from './EditSources/Gauge';
import ESScorecard from './EditSources/Scorecard';
import ESMap from './EditSources/Map';
import ESMSChart from './EditSources/MSChart';
import { useLocalization } from "hooks";

// const mapStateToProps = (state, props) => ({
// 	g: state.dsSystem.eGraph,
// 	sensor: state.data.sensor,
// 	cfs: [...state.data.functions, { id: -1, name: props.t('no.cloudfunction') }],
// 	sensors: state.data.sensors,
// 	deviceType: state.data.deviceType
// })

// const mapDispatchToProps = dispatch => ({
// 	editGraph: (newG) => dispatch(editGraph(newG)),
// 	getSensor: async id => dispatch(await getSensorLS(id)),
// 	getDeviceType: async id => dispatch(await getDeviceTypeLS(id)),
// 	unassignSensor: () => dispatch(unassignSensor())
// })

// @Andrei
export const EditDataSource = props => {
	const t = useLocalization()
	const dispatch = useDispatch()

	const g = useSelector(state => state.dsSystem.eGraph)
	const sensor = useSelector(state => state.data.sensor)
	const cfs = useSelector(state => [...state.data.functions, { id: -1, name: t('no.cloudfunction') }])
	const sensors = useSelector(state => state.data.sensors)
	const deviceType = useSelector(state => state.data.deviceType)

	// const [loading, setLoading] = useState(false)
	// const [dataSourceExp, setDataSourceExp] = useState(false)
	const [generalExp, setGeneralExp] = useState(true)
	const [selectDevice, setSelectDevice] = useState(false)
	const [selectFunction, setSelectFunction] = useState(false)
	const [filters, setFilters] = useState({ keyword: '' })
	const [dataSourceA, setDataSourceA] = useState(null) // added
	const [dataSourceB, setDataSourceB] = useState(null) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: false,
	// 		dataSourceExp: false,
	// 		generalExp: true,
	// 		selectDevice: false,
	// 		selectFunction: false,
	// 		filters: {
	// 			keyword: ''
	// 		}
	// 	}
	// }

	// two helpers that are being used in render
	const getSensor = async id => dispatch(await getSensorLS(id))
	const getDeviceType = async id => dispatch(await getDeviceTypeLS(id))

	useEffect(() => {
		return () => {
			dispatch(unassignSensor())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentWillUnmount = () => {
	// 	this.props.unassignSensor()
	// }
	// componentDidUpdate = async (prevProps, prevState) => {

	// }
	// const chartTypes = () => {
	// 	// const { t } = this.props
	// 	return [
	// 		{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
	// 		{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
	// 		{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
	// 		{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
	// 	]
	// }
	const handleEditDataKey = e => {
		let newG = { ...g }
		newG.dataSource.dataKey = e.target.value
		dispatch(editGraph(newG))
		// this.props.editGraph(newG)
	}
	const handleEditCF = d => () => {
		let newG = { ...g }
		newG.dataSource.cf = d
		dispatch(editGraph(newG))
		// this.props.editGraph(newG)
		setFilters({ keyword: '' })
		// this.setState({
		// 	filters: {
		// 		keyword: ''
		// 	}
		// })
		handleCloseF()
	}
	const handleEditDeviceAB = (d, s) => () => {
		let newG = { ...g }
		// Object.assign(newG, this.props.g)
		newG.dataSources[s].deviceId = d
		// this.props.getSensor(d)
		dispatch(editGraph(newG))
		// this.props.editGraph(newG)
		setFilters({ keyword: '' })
		// this.setState({
		// 	filters: {
		// 		keyword: ''
		// 	}
		// })
		handleCloseD()
	}
	const handleEditDevice = d => async () => {
		let newG = { ...g }
		// Object.assign(newG, this.props.g)
		newG.dataSource.deviceId = d
		dispatch(await getSensorLS(d))
		// this.props.getSensor(d)
		dispatch(editGraph(newG))
		setFilters({ keyword: '' })
		// this.setState({
		// 	filters: {
		// 		keyword: ''
		// 	}
		// })
		handleCloseD()
	}
	// const handleEditChartType = (e) => {
	// 	let newG = { ...g }
	// 	newG.period.chartType = e.target.value
	// 	newG.chartType = e.target.value
	// 	setLoading(true)
	// 	// this.setState({ loading: true })
	// 	dispatch(editGraph(newG))
	// 	setLoading(false)
	// 	// this.setState({ loading: false })
	// }
	const handleEditPeriodG = (menuId, to, from, defaultT) => {
		let newG = { ...g }
		newG.period = {
			...newG.period,
			menuId: menuId,
			to: to,
			from: from,
			timeType: defaultT
		}
		newG.periodType = menuId
		dispatch(editGraph(newG))
	}
	const handleEditG = (prop) => e => {
		let newG = { ...g }
		newG[prop] = e.target.value
		dispatch(editGraph(newG))
	}
	const handleEditName = (prop) => e => {
		let newG = { ...g }
		newG.dataSources[prop].label = e.target.value
		dispatch(editGraph(newG))
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}

	const closeDialog = () => { }

	// const handleChangeDS = () => setDataSourceExp(!dataSourceExp)
	const handleChangeGeneral = () => setGeneralExp(!generalExp)

	const handleChangeDSa = () => setDataSourceA(!dataSourceA)
	const handleChangeDSb = () => setDataSourceB(!dataSourceB)

	const handleOpenD = () => setSelectDevice(true)
	const handleOpenF = () => setSelectFunction(true)
	const handleCloseD = () => setSelectDevice(false)
	const handleCloseF = () => setSelectFunction(false)

	const renderSelectFunction = () => {
		const { classes } = props
		// const { selectFunction, filters } = this.state
		return <Dialog
			fullScreen
			open={selectFunction}
			onClose={handleCloseF}
			TransitionComponent={SlideT}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseF} aria-label='Close'>
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
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={closeDialog} aria-label='Close'>
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
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{cfs ? filterItems(cfs, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={handleEditCF(p.id)} value={p.id}>
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
	const renderSelectDevice = () => {
		const { classes } = props
		// const { selectDevice, filters } = this.state
		return <Dialog
			fullScreen
			open={selectDevice}
			onClose={handleCloseD}
			TransitionComponent={SlideT}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden smDown>
						<ItemG container alignItems={'center'}>
							<ItemG lg={2} md={4} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseD} aria-label='Close'>
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
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden mdUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseD} aria-label='Close'>
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
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				<ListItem button onClick={handleEditDevice('all')} value={'all'}>
					<ListItemText primary={'All'} />
				</ListItem>
				{sensors ? filterItems(sensors, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={handleEditDevice(p.id)} value={p.id}>
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
	const handleEditGraph = (newG) => {
		dispatch(editGraph(newG))
	}


	const { classes } = props
	// const { generalExp, dataSourceA, dataSourceB } = this.state
	switch (g.type) {
		case 0:
			return <ESChart
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				t={t}
				classes={classes}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		case 6:
			return <ESMSChart
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				getDeviceType={getDeviceType}
				t={t}
				classes={classes}
				sensor={sensor}
				deviceType={deviceType}
				g={g}
				cfs={cfs}
			/>
		case 1:
			return <ESGauge
				handleEditGraph={handleEditGraph}
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
						onChange={handleChangeGeneral}
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
										onChange={handleEditG('name')}
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
						onChange={handleChangeDSa}
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
										customSetDate={handleEditPeriodG}
										label={t('dashboard.fields.defaultPeriod')}
										inputType
										t={t}
										period={g.period} />
								</ItemG>
								<ItemG xs={12}>
									{renderSelectDevice()}
									<TextF
										id={'sensorChart'}
										label={t('dashboard.fields.device')}
										value={sensor ? sensor.name : t('no.device')}
										onClick={handleOpenD}
										onChange={() => { }}
									/>
								</ItemG>
								<ItemG>
									<TextF
										id={'scbAB-a-name'}
										label={t('dashboard.fields.name')}
										value={g.dataSources.a.label}
										onChange={handleEditName('a')}
									/>
								</ItemG>
								<Collapse unmountOnExit in={g.dataSources.a.deviceId > 0}>
									{g.dataSources.a.deviceId > 0 ?
										<Fragment>
											<ItemG>
												<DSelect
													simple
													value={g.dataSources.a.dataKey}
													onChange={handleEditDataKey}
													menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
												/>
											</ItemG>
											<ItemG>
												{renderSelectFunction()}
												<TextF
													id={'cfSelect'}
													label={t('dashboard.fields.cf')}
													value={cfs[cfs.findIndex(f => f.id === g.dataSources.a.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSources.a.cf)].name : t('no.function')}
													onClick={handleOpenF}
													onChange={() => { }}
												/>
											</ItemG>
											<ItemG xs={12}>
												<TextF
													onChange={handleEditG('unit')}
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
						onChange={handleChangeDSb}
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
										customSetDate={handleEditPeriodG}
										label={t('dashboard.fields.defaultPeriod')}
										inputType
										t={t}
										period={g.period} />
								</ItemG>
								<ItemG xs={12}>
									{renderSelectDevice(handleEditDeviceAB, 'a')}
									<TextF
										id={'sensorChart'}
										label={t('dashboard.fields.device')}
										value={sensor ? sensor.name : t('no.device')}
										onClick={handleOpenD}
										onChange={() => { }}
									/>
								</ItemG>
								<ItemG>
									<TextF
										id={'scbAB-b-name'}
										label={t('dashboard.fields.name')}
										value={g.dataSources.b.label}
										onChange={handleEditName('b')}
									/>
								</ItemG>
								<Collapse unmountOnExit in={g.dataSources.b.deviceId > 0}>
									{g.dataSources.b.deviceId > 0 ?
										<Fragment>
											<ItemG>
												<DSelect
													simple
													value={g.dataSources.b.dataKey}
													onChange={handleEditDataKey}
													menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
												/>
											</ItemG>
											<ItemG>
												{renderSelectFunction()}
												<TextF
													id={'cfSelect'}
													label={t('dashboard.fields.cf')}
													value={cfs[cfs.findIndex(f => f.id === g.dataSources.b.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSources.b.cf)].name : t('no.function')}
													onClick={handleOpenF}
													onChange={() => { }}
												/>
											</ItemG>
											<ItemG xs={12}>
												<TextF
													onChange={handleEditG('unit')}
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
				handleEditGraph={handleEditGraph}
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
		case 5:
			return <ESMap
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				t={t}
				classes={classes}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		default:
			break;
	}
}

export default withStyles(dashboardStyle)(EditDataSource)
