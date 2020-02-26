import React, { useState, Fragment, useEffect } from "react"
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse, Button } from '@material-ui/core'
import { T, ItemG, DSelect, TextF, DateFilterMenu } from 'components'
import { ExpandMore } from 'variables/icons'
import { /* PieChartRounded, DonutLargeRounded,  */BarChart, ShowChart } from 'variables/icons'
// import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog'
import { useLocalization } from 'hooks'
import AssignDeviceTypeDialog from 'components/AssignComponents/AssignDeviceTypeDialog'
import AssignSensorsDialog from 'components/AssignComponents/AssignSensorsDialog'
import editSourceStyles from 'assets/jss/components/dashboards/editSourceStyles'


const ESMSChart = (props) => {
	const { g, cfs, deviceType, getDeviceType } = props

	//Hooks
	const t = useLocalization()
	const classes = editSourceStyles()

	//State
	const [dataSourceExp, setDataSourceExp] = useState(false)
	const [generalExp, setGeneralExp] = useState(false)
	const [openSensorType, setOpenSensorType] = useState(false)
	const [openCF, setOpenCF] = useState(false)
	const [openSensors, setOpenSensors] = useState(false)
	//Constants
	const chartTypes = () => {
		return [
			// { value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
			// { value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
		]
	}

	useEffect(() => {
		getDeviceType(g.dataSource.deviceTypeId)

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
			case 'openSensorType':
				setOpenSensorType(val ? val : !openSensorType)
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

	const handleEditChartType = (e) => {
		let newG = { ...props.g }
		newG.period.chartType = e.target.value
		newG.chartType = e.target.value
		props.handleEditGraph(newG)
	}

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
	const handleEditSensors = selectedSensors => {
		let newG = { ...props.g }
		newG.dataSource.deviceIds = selectedSensors
		props.handleEditGraph(newG)
		setOpenSensors(false)
	}

	const handleEditCF = d => {
		let newG = { ...props.g }
		newG.dataSource.cf = d.id
		props.handleEditGraph(newG)
		handleExpand('openCF', false)()
	}


	const handleEditDeviceType = d => {
		let newG = { ...props.g }
		newG.dataSource.deviceTypeId = d.id
		// props.getSensor(d.id)
		props.getDeviceType(d.id)
		props.handleEditGraph(newG)
		handleExpand('openSensorType', false)()
	}

	const handleEditDataKey = e => {
		let newG = { ...props.g }
		newG.dataSource.dataKey = e.target.value
		props.handleEditGraph(newG)
	}

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
							<ItemG xs={12}>
								<DSelect
									onChange={handleEditChartType}
									label={t('dashboard.fields.chartType')}
									value={g.period.chartType}
									menuItems={chartTypes()}
								/>
							</ItemG>
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
								<AssignDeviceTypeDialog
									t={t}
									open={openSensorType}
									handleClose={handleExpand('openSensorType', false)}
									callBack={handleEditDeviceType}
								/>
								<TextF
									id={'sensorChart'}
									label={t('sensors.fields.deviceType')}
									value={deviceType ? deviceType.name : t('no.deviceType')}
									onClick={handleExpand('openSensorType', true)}
									onChange={() => { }}
								/>
							</ItemG>
							<Collapse unmountOnExit in={g.dataSource.deviceTypeId > 0}>
								{g.dataSource.deviceTypeId > 0 ?
									<Fragment>
										<ItemG>
											<AssignSensorsDialog
												open={openSensors}
												handleClose={() => setOpenSensors(false)}
												handleSave={handleEditSensors}
												selected={g.dataSource.deviceIds.map(d => d)}
												deviceTypeId={g.dataSource.deviceTypeId}
											/>
											<Button style={{ marginBottom: "8px", width: 230 }} variant={'outlined'} onClick={() => setOpenSensors(true)}>
												{g.dataSource.deviceIds.length > 0 ? t('menus.select.selectedDevices', { count: g.dataSource.deviceIds.length }) : t('menus.select.devices')}
											</Button>
										</ItemG>
										<ItemG>
											<DSelect
												simple
												value={g.dataSource.dataKey}
												onChange={handleEditDataKey}
												menuItems={deviceType ? deviceType.outbound ? deviceType.outbound.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
											/>
										</ItemG>
										<ItemG>
											<AssignCFDialog
												t={t}
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
										<ItemG xs={12}>
											<TextF
												onChange={handleEditGraph('unit')}
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
	)
}


export default ESMSChart
