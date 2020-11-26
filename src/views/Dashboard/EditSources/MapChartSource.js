import React, { Fragment, useState, useEffect } from "react"
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse } from '@material-ui/core'
import { T, ItemG, DSelect, TextF, DateFilterMenu, Muted } from 'components'
import { ExpandMore } from 'variables/icons'
// import { /* PieChartRounded, DonutLargeRounded, */ BarChart, ShowChart } from 'variables/icons'
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog'
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog'
import { useDispatch, useLocalization } from 'hooks'
import editSourceStyles from 'assets/jss/components/dashboards/editSourceStyles'
import { resetSensor } from 'redux/data'


const MapChartSource = (props) => {
	const { sensor, g, cfs, getSensor } = props
	//Hooks

	const t = useLocalization()
	const classes = editSourceStyles()
	const dispatch = useDispatch()
	//State
	const [dataSourceExp, setDataSourceExp] = useState(false)
	const [generalExp, setGeneralExp] = useState(false)
	const [openSensor, setOpenSensor] = useState(false)
	const [openCF, setOpenCF] = useState(false)

	//Constants
	// const chartTypes = () => {
	// 	return [
	// 		// { value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
	// 		// { value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
	// 		{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
	// 		{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
	// 	]
	// }

	//useEffect
	useEffect(() => {

		if ((!sensor && g.dataSource.deviceUUID) || (g.dataSource.deviceUUID && (sensor.uuid !== g.dataSource.deviceUUID))) {
			let id = g.dataSource.deviceUUID
			getSensor(id)
		}
		return () => {
			dispatch(resetSensor())
		}
		//eslint-disable-next-line
	}, [])
	//Handlers

	const handleExpand = (prop, val) => e => {
		switch (prop) {
			case 'dataSourceExp':
				setDataSourceExp(val ? val : !dataSourceExp)
				break
			case 'generalExp':
				setGeneralExp(val ? val : !generalExp)
				break
			case 'openSensor':
				setOpenSensor(val ? val : !openSensor)
				break
			case 'openCF':
				setOpenCF(val ? val : !openCF)
				break
			default:
				break
		}
	}


	const handleEditGraph = (prop) => e => {
		let newG = { ...g }
		newG[prop] = e.target.value
		props.handleEditGraph(newG)
	}

	// const handleEditChartType = (e) => {
	// 	let newG = { ...props.g }
	// 	newG.period.chartType = e.target.value
	// 	newG.chartType = e.target.value
	// 	props.handleEditGraph(newG)
	// }

	const handleEditPeriodG = (menuId, to, from, defaultT) => {
		let newG = { ...props.g }
		newG.period = {
			...newG.period,
			menuId: menuId,
			to: to,
			from: from,
			timeType: defaultT
		}
		newG.periodType = menuId
		props.handleEditGraph(newG)
	}
	const handleEditCF = d => {
		let newG = { ...props.g }
		newG.dataSource.cf = d.id
		props.handleEditGraph(newG)
		handleExpand('openCF', false)()
	}


	const handleEditDevice = d => {
		let newG = { ...props.g }
		newG.dataSource.deviceId = d.id
		newG.dataSource.deviceUUID = d.uuid
		props.getSensor(d.uuid)
		props.handleEditGraph(newG)
		handleExpand('openSensor', false)()
	}

	const handleEditDataKey = type => e => {
		let newG = { ...props.g }
		newG.dataSource[type] = e.target.value
		// let unit = sensor.dataKeys ? sensor.dataKeys[sensor.dataKeys.findIndex(f => f.key === e.target.value)].unit : ''
		// newG.unit = unit
		props.handleEditGraph(newG)
	}

	// const handleEditRefresh = e => {
	// 	let newG = { ...props.g }
	// 	newG.refresh = e.target.value
	// 	props.handleEditGraph(newG)
	// }

	// const handleEditDefaultRefresh = e => {
	// 	let newG = { ...props.g }
	// 	newG.defaultRefresh = e.target.value
	// 	props.handleEditGraph(newG)
	// }

	return (
		<Fragment>
			<ItemG xs={12}>
				<ExpansionPanel
					expanded={generalExp}
					square
					onChange={handleExpand('generalExp')}
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
									onChange={handleEditGraph('name')}
									autoFocus
									id={'name'}
									label={t('dashboard.fields.label')}
									value={g.name}
									margin='normal'
								/>
							</ItemG>
							{/* <ItemG xs={12}>
								<DSelect
									onChange={handleEditChartType}
									label={t('dashboard.fields.chartType')}
									value={g.period.chartType}
									menuItems={chartTypes()}
								/>
							</ItemG> */}
						</ItemG>
					</ExpansionPanelDetails>

				</ExpansionPanel>

			</ItemG>
			<ItemG xs={12}>
				<ExpansionPanel
					expanded={dataSourceExp}
					square
					onChange={handleExpand('dataSourceExp')}
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
								<AssignSensorDialog
									t={t}
									open={openSensor}
									handleClose={handleExpand('openSensor', false)}
									callBack={handleEditDevice}
								/>
								<TextF
									id={'sensorChart'}
									label={t('dashboard.fields.device')}
									value={sensor ? sensor.name : t('no.device')}
									onClick={handleExpand('openSensor', true)}
									onChange={() => { }}
								/>
							</ItemG>
							<Collapse unmountOnExit in={g.dataSource.deviceUUID}>
								{g.dataSource.deviceUUID ?
									<Fragment>
										<ItemG>
											<DSelect
												margin={'normal'}
												label={t('sensors.fields.lat')}
												value={g.dataSource['lat']}
												onChange={handleEditDataKey('lat')}
												menuItems={sensor ?
													sensor.dataKeys ?
														sensor.dataKeys.map(dt => ({
															label:
																<ItemG>{dt.label ? dt.label : dt.key}
																	<Muted>
																		{dt.key}
																	</Muted>
																</ItemG>, value: dt.key
														}))
														: []
													: []
												}
											/>
										</ItemG>
										<ItemG>
											<DSelect
												margin={'normal'}
												value={g.dataSource['long']}
												onChange={handleEditDataKey('long')}
												label={t('sensors.fields.long')}
												menuItems={sensor ?
													sensor.dataKeys ?
														sensor.dataKeys.map(dt => ({
															label:
																<ItemG>{dt.label ? dt.label : dt.key}
																	<Muted>
																		{dt.key}
																	</Muted>
																</ItemG>, value: dt.key
														}))
														: []
													: []
												}
											/>
										</ItemG>
										<ItemG>
											<AssignCFDialog
												open={openCF}
												handleClose={handleExpand('openCF', false)}
												callBack={handleEditCF}
											/>
											<TextF
												id={'cfSelect'}
												label={t('dashboard.fields.cf')}
												value={cfs[cfs.findIndex(f => f.id === g.dataSource.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSource.cf)].name : t('no.function')}
												onClick={handleExpand('openCF', true)}
												onChange={() => { }}
											/>
										</ItemG>
										{/* <ItemG xs={12}>
											<DSelect
												margin={'normal'}
												label={t('dashboard.fields.refresh')}
												value={g.refresh}
												onChange={handleEditRefresh}
												menuItems={[
													{ value: 0, label: t('no.dashboardRefresh') },
													{ value: 5, label: 5 },
													{ value: 10, label: 10 },
													{ value: 30, label: 30 },
													{ value: 60, label: 60 },
													// { value: 1, label: t('cloudfunctions.fields.types.external') },
												]}
											/>
										</ItemG>
										<ItemG xs={12}>
											<DSelect
												fullWidth
												margin={'normal'}
												label={t('dashboard.fields.refreshDefault')}
												value={g.defaultRefresh}
												onChange={handleEditDefaultRefresh}
												menuItems={
													[
														{ value: false, label: t('actions.off') },
														{ value: true, label: t('actions.on') }
													]
												}
											/>
										</ItemG> */}
									</Fragment>
									: null}
							</Collapse>
						</ItemG>
					</ExpansionPanelDetails>

				</ExpansionPanel>
			</ItemG>
		</Fragment>
	)
}

export default MapChartSource
