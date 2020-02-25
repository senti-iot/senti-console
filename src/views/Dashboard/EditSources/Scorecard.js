import React, { Fragment, useState } from "react"
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse, Button } from '@material-ui/core'
import { T, ItemG, DSelect, TextF, ITB } from 'components'
import { ExpandMore, Add, Delete } from 'variables/icons'
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog'
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog'
import { useLocalization } from 'hooks'
import editSourceStyles from 'assets/jss/components/dashboards/editSourceStyles'

//@Andrei
const ESScorecard = props => {
	//Hooks
	const t = useLocalization()
	const classes = editSourceStyles()
	//Redux
	const { sensor, cfs, g } = props


	//State
	const [dataSourceExp, setDataSourceExp] = useState(false)
	const [generalExp, setGeneralExp] = useState(false)
	const [openSensor, setOpenSensor] = useState([...g.dataSources.map((ds, i) => false)])
	const [openCF, setOpenCF] = useState([...g.dataSources.map((ds, i) => false)])
	const [scorecard, setScorecard] = useState([...g.dataSources.map((ds, i) => false)])
	//Const

	// 	setOpenCF({
	// 		...openCF,
	// 		[i]: false
	// 	})
	// 	setOpenSensor({
	// 		...openSensor,
	// 		[i]: false
	// 	})
	// 	setScorecard({
	// 		...scorecard,
	// 		[i]: false
	// 	})
	// })
	//useCallbacks

	//useEffects

	//Handlers

	const handleExpand = (prop, val, i) => e => {
		switch (prop) {
			case 'dataSourceExp':
				setDataSourceExp(val ? val : !dataSourceExp)
				break
			case 'generalExp':
				setGeneralExp(val ? val : !generalExp)
				break
			case 'openSensor':
				setOpenSensor({
					...openSensor,
					[i]: val ? val : !openSensor[i]
				})
				break
			case 'openCF':
				setOpenCF({
					...openCF,
					[i]: val ? val : !openCF[i]
				})
				break
			case 'scorecard':
				setScorecard({
					...scorecard,
					[i]: val ? val : !scorecard[i]
				})
				break
			default:
				break
		}
	}

	const handleEditLabel = i => e => {
		let newG = { ...g }
		newG.dataSources[i].label = e.target.value
		props.handleEditGraph(newG)
	}
	const handleEditUnit = i => e => {
		let newG = { ...g }
		newG.dataSources[i].unit = e.target.value
		props.handleEditGraph(newG)
	}

	const handleEditCF = i => d => {
		let newG = { ...g }
		newG.dataSources[i].cf = d.id
		props.handleEditGraph(newG)
		handleExpand('openCF', false, i)()
	}
	const handleEditDevice = i => d => {
		let newG = { ...g }
		newG.dataSources[i].deviceId = d.id
		props.getSensor(d.id)
		props.handleEditGraph(newG)
		handleExpand('openSensor', false, i)()
	}

	const handleEditDataKey = i => e => {
		let newG = { ...g }
		newG.dataSources[i].dataKey = e.target.value
		props.handleEditGraph(newG)
	}
	const handleAddDataSource = () => {
		let newG = { ...g }
		newG.dataSources.push({
			cf: -1,
			dataKey: "",
			deviceId: -1,
			label: "",
			unit: ""
		})
		props.handleEditGraph(newG)
	}
	const handleRemoveDataSource = index => e => {
		e.stopPropagation()
		let newG = { ...g }
		newG.dataSources = newG.dataSources.filter((ds, i) => index !== i)
		props.handleEditGraph(newG)
	}
	const handleEditGraph = (prop) => e => {
		let newG = { ...g }
		newG[prop] = e.target.value
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
								<Button color={'primary'} fullWidth style={{ borderRadius: 0 }} onClick={handleAddDataSource}>
									{`${t('actions.add')} ${t('dashboard.fields.dataSource')}`}
								</Button>
							</ItemG>
						</ItemG>
					</ExpansionPanelDetails>

				</ExpansionPanel>

			</ItemG>
			<ItemG xs={12}>

				<ExpansionPanel
					expanded={false}
					square
					// onChange={handleAddDataSource}
					classes={{
						root: classes.expansionPanel
					}}
				>
					<Button style={{ textTransform: 'none', textAlign: 'left', width: '100%' }} onClick={handleAddDataSource}>
						<ExpansionPanelSummary className={classes.expandButton} expandIcon={<Add className={classes.icon} />}>
							<T>{`${t('actions.add')} ${t('dashboard.fields.dataSource')}`}</T>
						</ExpansionPanelSummary>
					</Button>
				</ExpansionPanel>

			</ItemG>
			{g.dataSources.map((ds, i) => {
				return <ItemG key={i} xs={12}><ExpansionPanel
					expanded={scorecard[i]}
					square
					onChange={handleExpand('scorecard', undefined, i)}
					classes={{
						root: classes.expansionPanel
					}}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
						<ItemG container justify={'space-between'} alignItems={'center'}>

							<T>{`${t('dashboard.fields.dataSource')}`}</T>
							<ITB
								onClick={handleRemoveDataSource(i)}
								size={'small'}
								label={'actions.delete'}
								icon={<Delete />}
							/>
						</ItemG>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<ItemG container>
							<ItemG xs={12}>
								<AssignSensorDialog
									all
									t={t}
									open={openSensor[i]}
									handleClose={handleExpand('openSensor', false, i)}
									callBack={handleEditDevice(i)}
								/>
								<TextF
									id={'sensorChart'}
									label={t('dashboard.fields.device')}
									value={sensor ? sensor.name : t('no.device')}
									onClick={handleExpand('openSensor', true, i)}
									onChange={() => { }}
								/>
							</ItemG>
							<Collapse unmountOnExit in={ds.deviceId > 0}>

								{ds.deviceId > 0 ?
									<Fragment>
										<ItemG xs={12}>
											<TextF
												onChange={handleEditLabel(i)}
												autoFocus
												id={'label' + i}
												label={t('dashboard.fields.label')}
												value={ds.label}
												margin='normal'
											/>
										</ItemG>
										<ItemG xs={12}>
											<TextF
												onChange={handleEditUnit(i)}
												autoFocus
												id={'unit' + i}
												label={t('dashboard.fields.unit')}
												value={ds.unit}
												margin='normal'
											/>
										</ItemG>
										<ItemG>
											<DSelect
												simple
												value={ds.dataKey}
												onChange={handleEditDataKey(i)}
												menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
											/>
										</ItemG>
										<ItemG>
											<AssignCFDialog
												t={t}
												open={openCF[i]}
												handleClose={handleExpand('openCF', false, i)}
												callBack={handleEditCF(i)}
											/>
											<TextF
												id={'cfSelect' + i}
												label={t('dashboard.fields.cf')}
												value={cfs[cfs.findIndex(f => f.id === ds.cf)] ? cfs[cfs.findIndex(f => f.id === ds.cf)].name : t('no.function')}
												onClick={handleExpand('openCF', true, i)}
												onChange={() => { }}
											/>
										</ItemG>

									</Fragment>
									: null}
							</Collapse>
						</ItemG>
					</ExpansionPanelDetails>

				</ExpansionPanel>
				</ItemG>
			})
			}

		</Fragment>
	)

}

export default ESScorecard
