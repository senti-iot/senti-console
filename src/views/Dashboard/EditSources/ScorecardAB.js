import React, { useState } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, DateFilterMenu, } from 'components';
import { ExpandMore } from 'variables/icons';
// import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';

import { editGraph } from 'redux/dsSystem';

import { useLocalization, useDispatch } from 'hooks';
import editSourceStyles from 'assets/jss/components/dashboards/editSourceStyles';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import AssignCloudFunctionDialog from 'components/AssignComponents/AssignCFDialog';

const ESScorecardAB = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = editSourceStyles()
	//Redux

	//State
	// const [loading, setLoading] = useState(true)
	const [selectDevice, setSelectDevice] = useState(false)
	const [selectFunction, setSelectFunction] = useState(false)

	const [generalExp, setGeneralExp] = useState(true)
	// const [dataSourceExp, setDataSourceExp] = useState(false)
	const [dataSourceA, setDataSourceA] = useState(false)
	const [dataSourceB, setDataSourceB] = useState(false)

	//Const
	const { g, cfs, sensor } = props
	//useCallbacks

	//useEffects

	//Handlers
	const handleCloseD = () => setSelectDevice(false)
	const handleCloseF = () => setSelectFunction(false)

	const handleChangeGeneral = () => setGeneralExp(!generalExp)

	const handleChangeDSa = () => setDataSourceA(!dataSourceA)
	const handleChangeDSb = () => setDataSourceB(!dataSourceB)

	const handleOpenD = () => setSelectDevice(true)
	const handleOpenF = () => setSelectFunction(true)

	const handleEditDataKey = e => {
		let newG = { ...g }
		newG.dataSource.dataKey = e.target.value
		dispatch(editGraph(newG))
	}
	const handleEditDeviceAB = (d, s) => () => {
		let newG = { ...g }
		newG.dataSources[s].deviceId = d.id
		dispatch(editGraph(newG))
	}
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
	const handleEditCF = d => {
		let newG = { ...g }
		newG.dataSource.cf = d.id
		dispatch(editGraph(newG))
		handleCloseF()
	}
	return (
		<>
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
								{/* TODO: AssignSensor */}
								{/* {renderSelectDevice()} */}
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
									<>
										<ItemG>
											<DSelect
												simple
												value={g.dataSources.a.dataKey}
												onChange={handleEditDataKey}
												menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
											/>
										</ItemG>
										<ItemG>
											{/* TODO: AssignFunction */}
											{/* {renderSelectFunction()} */}
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
									</>
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
								{/* todo AssignDevice */}
								{/* {renderSelectDevice(handleEditDeviceAB, 'a')} */}
								<AssignSensorDialog
									t={t}
									open={selectDevice}
									handleClose={handleCloseD}
									callBack={sensor => {
										handleEditDeviceAB(sensor, 'a')
										handleCloseD()
									}}
								/>
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
									<>
										<ItemG>
											<DSelect
												simple
												value={g.dataSources.b.dataKey}
												onChange={handleEditDataKey}
												menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
											/>
										</ItemG>
										<ItemG>
											{/* {renderSelectFunction()} */}
											<AssignCloudFunctionDialog
												open={selectFunction}
												handleClose={handleCloseF}
												callBack={cf => {
													handleEditCF(cf)
													handleCloseF()
												}}
											/>
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
									</>
									: null}
							</Collapse>
						</ItemG>
					</ExpansionPanelDetails>

				</ExpansionPanel>
			</ItemG>
		</>
	)
}

export default ESScorecardAB
