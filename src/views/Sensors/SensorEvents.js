import { Fade, Button } from '@material-ui/core';
import { CircularLoader, GridContainer, InfoCard, ItemGrid, TextF, T } from 'components';
import React, { Fragment, useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, SystemUpdate, InsertChart, Wifi, Backup /* StorageIcon */ } from 'variables/icons';
import { getFunctions, getSensorLS } from "redux/data"
import { scrollToAnchor } from 'variables/functions';
import { useLocalization, useSnackbar, useHistory } from 'hooks';
import { useRouteMatch, useLocation, useParams } from "react-router-dom"
import { eventServicesAPI } from 'variables/data';
import m from 'ace-builds/src-noconflict/mode-json';
import createSensorStyles from 'assets/jss/components/sensors/createSensorStyles'
import { set } from 'store';

const SensorEvents = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const match = useRouteMatch()
	const location = useLocation()
	const params = useParams()
	const classes = createSensorStyles()


	// State
	// const [loading, setLoading] = useState(false)
	const [mqttAction, setMqttAction] = useState(false)

	// Redux
	// const senso = useSelector(store => store.data.deviceType)
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const user = useSelector(state => state.settings.user)
	const sensor = useSelector(state => state.data.sensor)
	const loading = useSelector(state => !state.data.gotSensor) || !mqttAction

	//Const
	const { setTabs, setBC, setHeader } = props

	const handleChange = (what) => e => {
		let newMqttAction = { ...mqttAction }
		newMqttAction.config[what] = e.target.value
		setMqttAction(newMqttAction)
	}
	const handleChangeHost = () => e => {
		let newMqttAction = { ...mqttAction }
		newMqttAction.host = e.target.value
		setMqttAction(newMqttAction)
	}

	const handleSave = async () => {
		let action = null
		if (mqttAction.uuid === false) {
			action = await eventServicesAPI.post('/mqtt/device/' + sensor.uuid, mqttAction)
		} else {
			action = await eventServicesAPI.put('/mqtt/device/' + sensor.uuid, mqttAction)
		}
		if (action.data.status === "ok") {
			s(t("devices.mqttAlerts.saved"))
			setMqttAction(action.data.result)
		} else {
			s(t("devices.mqttAlerts.error"))
			setMqttAction(action.data.result)
		}
	}
	const goToSensor = useCallback(() => history.push('/sensor/' + sensor.uuid + '#details'), [history])
	
	const getSensorMqtt = useCallback(async id => {
		let action = await eventServicesAPI.get('/mqtt/device/' + id)
		console.log('getSensorMqtt', action)
		if (action.ok && action.data.status === "ok") {
			setMqttAction(action.data.result)
		} else {
			setMqttAction({
				"uuid": false,
				"ruleUUID": false,
				"config": {
					"topic": "",
					"deviceId": "",
					"mqtthost": "",
					"mqttpass": "",
					"mqttuser": ""
				},
				"host": ""
			})
		}
	}, [dispatch])

	const getSensor = useCallback(async id => {
		await dispatch(await getFunctions(true))
		await dispatch(await getSensorLS(id))
	}, [dispatch])

	//useEffects
	useEffect(() => {
		if (sensor) {
			const tabs = [
				{ id: 0, title: t("tabs.details"), label: <DataUsage />, url: '/sensor/' + sensor.uuid + `#details` },
				{ id: 1, title: t("sidebar.messages"), label: <InsertChart />, url: '/sensor/' + sensor.uuid + `#messages` },
				{ id: 2, title: t("registries.fields.protocol"), label: <Wifi />, url: '/sensor/' + sensor.uuid + `#protocol` },
			]
			if (user.role.type < 4) {
				tabs.push({ id: 3, title: t("tabs.mqttForward"), label: <Backup />, url: '/sensor/' + sensor.uuid + '/events' })
			}
			setTabs({
				route: 3,
				id: "sensor",
				tabs: tabs,
				hashLinks: true
			})
			setBC('sensor', sensor.name)

			let prevURL = location.prevURL ? location.prevURL : `/sensors/list`
			setHeader('sidebar.device', true, prevURL, 'manage.sensors')
			// console.log('mqtt', mqttAction)
			console.log('user', user.role)
		}
	}, [location, sensor, setBC, setHeader, setTabs, t])
	useEffect(() => {
		if (location.hash !== '') {
			scrollToAnchor(location.hash)
		}
	}, [location.hash])
	useEffect(() => {
		console.log('mqtt', mqttAction)
	}, [mqttAction])

	useEffect(() => {
		console.log('useEffect first', params)
		const gSensor = async () => {
			if (params) {
				let id = params.id
				if (id) {
					await getSensor(id)
				}

				if (location.hash !== "") {
					scrollToAnchor(location.hash)
				}
			}
		}
		gSensor()
		const gSensorMqtt = async () => {
			if (params) {
				let id = params.id
				if (id) {
					await getSensorMqtt(id)
				}
			}
		}
		gSensorMqtt()
		//eslint-disable-next-line
	}, [])
	return (
		<>
			{(!loading) ? <Fade in={true} timeout={500}>
				<GridContainer justify={'center'}>
					<ItemGrid xs={12} sm={12} md={12}>
						<InfoCard
							title={t('devices.fields.description')}
							noExpand
							noHeader
							avatar={<Backup />}
							content={
								<Fragment>
									<ItemGrid xs={12}>{t("devices.mqttText.intro")}</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'topic'}
											label={t('devices.fields.mqttTopic')}
											onChange={handleChange('topic')}
											value={mqttAction.config.topic}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'deviceId'}
											label={t('devices.fields.mqttDeviceId')}
											onChange={handleChange('deviceId')}
											value={mqttAction.config.deviceId}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'mqtthost'}
											label={t('devices.fields.mqttHost')}
											onChange={handleChange('mqtthost')}
											value={mqttAction.config.mqtthost}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'mqttuser'}
											label={t('devices.fields.mqttUser')}
											onChange={handleChange('mqttuser')}
											value={mqttAction.config.mqttuser}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'mqttpass'}
											label={t('devices.fields.mqttPass')}
											onChange={handleChange('mqttpass')}
											value={mqttAction.config.mqttpass}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid xs={12}>
										<TextF
											id={'host'}
											label={t('devices.fields.mqttWL')}
											onChange={handleChangeHost()}
											value={mqttAction.host}
											autoFocus
										/>
									</ItemGrid>
									<ItemGrid container>
										{/* <div className={classes.wrapper}>
											<Button
												variant='outlined'
												onClick={goToSensor}
												className={classes.redButton}
											>
												{t('actions.cancel')}
											</Button>
										</div> */}
										<div className={classes.wrapper}>
											<Button onClick={handleSave} variant={'outlined'} color={'primary'}>
												{t('actions.save')}
											</Button>
										</div>
									</ItemGrid>

								</Fragment>
							}
						/>
					</ItemGrid>
				</GridContainer>
			</Fade>
				: <CircularLoader />}
		</>
	)
}

export default SensorEvents