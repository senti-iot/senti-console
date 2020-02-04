import { Fade } from "@material-ui/core"
import {
	CircularLoader,
	GridContainer,
	ItemGrid,
	DeleteDialog
} from "components"
import React, { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataUsage, InsertChart, Wifi } from "variables/icons"
import { isFav, addToFav, removeFromFav, finishedSaving } from "redux/favorites"
import { scrollToAnchor } from "variables/functions"
import { getSensorLS, unassignSensor } from "redux/data"
import SensorDetails from "./SensorCards/SensorDetails"
import SensorProtocol from "./SensorCards/SensorProtocol"
import SensorMessages from "views/Charts/SensorMessages"
import { getSensorMessages } from "variables/dataSensors"
import { deleteSensor } from "variables/dataSensors"
// import DoubleChart from 'views/Charts/DoubleChart';
// import SensorData from './SensorCards/SensorData';
import SensorChart from "views/Charts/SensorChart"
import { useLocalization, useSnackbar } from "hooks"
import { useRouteMatch, useHistory } from "react-router-dom"

// const mapDispatchToProps = dispatch => ({
// 	isFav: favObj => dispatch(isFav(favObj)),
// 	addToFav: favObj => dispatch(addToFav(favObj)),
// 	removeFromFav: favObj => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getSensor: async id => dispatch(await getSensorLS(id)),
// 	unassignSensor: () => dispatch(unassignSensor())
// })

const Sensor = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useRouteMatch()
	// const params = useParams()
	const history = useHistory()
	//Redux
	const accessLevel = useSelector(s => s.settings.user.privileges)
	// const language = useSelector(state => state.settings.language)
	const saved = useSelector(state => state.favorites.saved)
	// const mapTheme = useSelector(state => state.settings.mapTheme)
	const periods = useSelector(state => state.dateTime.periods)
	const sensor = useSelector(state => state.data.sensor)
	const loading = useSelector(state => !state.data.gotSensor)

	//State
	// const [registry, setRegistry] = useState(null)
	// const [activeDevice, setActiveDevice] = useState(null)
	// const [loading, setLoading] = useState(true)
	// const [anchorElHardware, setanchorElHardware] = useState(null)
	// const [openAssign, setopenAssign] = useState(false)
	const [openDelete, setopenDelete] = useState(false)
	// const [loadingMap, setloadingMap] = useState(true)
	// const [heatData, setheatData] = useState(null)
	// const [value, setvalue] = useState(0)
	// const [weather, setWeather] = useState(null) // added
	const [sensorMessages, setSensorMessages] = useState(null) // added
	// const [assignDevice, setAssignDevice] = useState(false) // added
	// const [assignProject, setAssignProject] = useState(false) // added
	// const [unassignDevice, setUnassignDevice] = useState(false) // added
	//Const

	/* 	constructor(props) {
		  super(props)

		  this.state = {
			  registry: null,
			  activeDevice: null,
			  loading: true,
			  anchorElHardware: null,
			  openAssign: false,
			  openDelete: false,
			  //Map
			  loadingMap: true,
			  heatData: null,
			  value: 0
			  //End Map
		  }
		  let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
		  props.setHeader('sidebar.device', true, prevURL, 'manage.sensors')
	  } */

	// const format = "YYYY-MM-DD+HH:mm"
	const tabs = () => {
		return [
			{
				id: 0,
				title: t("tabs.details"),
				label: <DataUsage />,
				url: `#details`
			},
			{
				id: 1,
				title: t("sidebar.messages"),
				label: <InsertChart />,
				url: `#messages`
			},
			{
				id: 2,
				title: t("registries.fields.protocol"),
				label: <Wifi />,
				url: `#protocol`
			}
			// { id: 1, title: t('tabs.data'), label: <Timeline />, url: `#data` },
			// { id: 2, title: t('tabs.map'), label: <Map />, url: `#map` },
			// { id: 3, title: t('tabs.activeDevice'), label: <DeviceHub />, url: `#active-device` },
			// { id: 4, title: t('tabs.history'), label: <History />, url: `#history` }
		]
	}

	// const reload = msgId => {
	// 	snackBarMessages(msgId)
	// 	getSensor(props.match.params.id)
	// }
	const getSensor = async id => {
		// const { getSensor } = props
		await dispatch(await getSensorLS(id))
	}
	// const componentDidUpdate = async prevProps => {
	// 	if (props.registry && !prevProps.registry) {
	// 		// TODO
	// 		// if (registry.activeDevice) {
	// 		// 	let data = await getWeather(
	// 		// 		registry.activeDevice,
	// 		// 		moment(),
	// 		// 		props.language
	// 		// 	)
	// 		// 	setWeather(data)
	// 	}
	// }
	// if (saved === true) {
	// 	if (isFavorite({ id: sensor.id, type: "sensor" })) {
	// 		s("snackbars.favorite.saved", {
	// 			name: sensor.name,
	// 			type: t("favorites.types.device")
	// 		})
	// 		dispatch(finishedSaving())
	// 	}
	// 	if (!isFavorite({ id: sensor.id, type: "sensor" })) {
	// 		s("snackbars.favorite.removed", {
	// 			name: sensor.name,
	// 			type: t("favorites.types.device")
	// 		})
	// 		dispatch(finishedSaving())
	// 	}
	// }
	// const componentWillUnmount = () => {
	// 	props.unassignSensor()
	// }
	useEffect(() => {
		const getSensors = async () => {
			if (props.match) {
				let id = props.match.params.id
				if (id) {
					await getSensor(id).then(() => {
						console.log(sensor)
						//TODO
						// props.setBC('sensor', sensor.name)
					})
					props.setTabs({
						route: 0,
						id: "sensor",
						tabs: tabs(),
						hashLinks: true
					})
					if (props.location.hash !== "") {
						scrollToAnchor(props.location.hash)
					}
				}
			}
		}
		getSensors()

		return () => {
			dispatch(unassignSensor())
		}
		//eslint-disable-next-line
	}, [])

	const isFavorite = (favObj) => dispatch(isFav(favObj))

	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: sensor.id, type: "sensor" }))) {
				s("snackbars.favorite.saved", {
					name: sensor.name,
					type: t("favorites.types.device")
				})
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: sensor.id, type: "sensor" }))) {
				s("snackbars.favorite.removed", {
					name: sensor.name,
					type: t("favorites.types.device")
				})
				dispatch(finishedSaving())
			}
		}
	}, [dispatch, s, saved, sensor, t])
	// const componentDidMount = async () => {
	// 	if (props.match) {
	// 		let id = props.match.params.id
	// 		if (id) {
	// 			await getSensor(id).then(() => {
	// 				props.setBC("sensor", props.sensor.name)
	// 			})
	// 			props.setTabs({
	// 				route: 0,
	// 				id: "sensor",
	// 				tabs: this.tabs(),
	// 				hashLinks: true
	// 			})
	// 			if (props.location.hash !== "") {
	// 				scrollToAnchor(props.location.hash)
	// 			}
	// 		}
	// 	} else {
	// 		props.history.push({
	// 			pathname: "/404",
	// 			prevURL: window.location.pathname
	// 		})
	// 	}
	// }
	const addToFavorites = () => {
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: "sensor",
			path: props.match.url
		}
		dispatch(addToFav(favObj))
		// props.addToFav(favObj)
	}
	const removeFromFavorites = () => {
		//TODO
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: "sensor",
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
		// props.removeFromFav(favObj)
	}
	const getDeviceMessages = async () => {
		await getSensorMessages(sensor.id, periods[0]).then(rs => {
			setSensorMessages(rs)
		})
	}
	const snackBarMessages = msg => {
		// const { s, t, registry } = this.props

		switch (msg) {
			default:
				break
		}
	}
	const handleOpenDeleteDialog = () => {
		setopenDelete(true)
	}
	const handleCloseDeleteDialog = () => {
		setopenDelete(false)
	}
	const handleDeleteSensor = async () => {
		const { sensor } = props
		if (isFavorite(sensor.id)) removeFromFavorites()
		await deleteSensor(sensor.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			props.history.push("/sensors/list")
		})
	}
	// const handleOpenAssignDevice = () => setopenAssign(true)
	// const handleOpenAssignProject = () => setAssignProject(true)

	const renderDeleteDialog = () => {
		const { t } = props
		return (
			<DeleteDialog
				t={t}
				title={"dialogs.delete.title.device"}
				message={"dialogs.delete.message.device"}
				messageOpts={{ sensor: sensor.name }}
				open={openDelete}
				single
				handleCloseDeleteDialog={handleCloseDeleteDialog}
				handleDelete={handleDeleteSensor}
			/>
		)
	}
	const renderLoader = () => {
		return <CircularLoader />
	}
	return (
		<Fragment>
			{!loading ? (
				<Fade in={true}>
					<GridContainer justify={"center"} alignContent={"space-between"}>
						<ItemGrid xs={12} noMargin id="details">
							<SensorDetails
								isFav={isFavorite({ id: sensor.id, type: "sensor" })}
								addToFav={addToFavorites}
								removeFromFav={removeFromFavorites}
								sensor={sensor}
								history={history}
								match={match}
								handleOpenDeleteDialog={handleOpenDeleteDialog}
								// handleOpenAssignDevice={handleOpenAssignDevice}
								accessLevel={accessLevel}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={"messages"}>
							<SensorMessages
								period={periods[0]}
								t={t}
								messages={sensorMessages}
								getData={getDeviceMessages}
							/>
						</ItemGrid>
						{sensor.dataKeys
							? sensor.dataKeys.map((k, i) => {
								if (k.type === 1) {
									return null
								}
								if (k.type === 0) {
									// return null
									return (
										<ItemGrid xs={12} container noMargin id={"charts"}>
											<SensorChart
												deviceId={sensor.id}
												dataKey={k.key}
												title={k.key}
												cfId={k.nId}
												chartColor={"teal"}
												single={true}
												t={t}
											/>
										</ItemGrid>
									)
								}
								return null
							})
							: null}
						{/* {sensor.dataKeys ? sensor.dataKeys.map((k, i) => {
							if (k.type === 1) {
								return <ItemGrid xs={12} container noMargin key={i + 'gauges'}>
									<GaugeData
										v={k.key}
										nId={k.nId}
										t={t}
										period={periods[0]}
										sensor={sensor}
									/>
								</ItemGrid>

							}
							else return null
						}) : null} */}
						{/* <ItemGrid xs={12} container noMaring id={'charts'}> */}
						{/* {sensor.dataKeys ? sensor.dataKeys.map((k, i) => {
							if (k.type === 0)
								return <ItemGrid xs={12} container noMargin key={i + 'charts'}>
									<SensorData
										periods={periods}
										sensor={sensor}
										history={history}
										match={match}
										t={t}
										v={k.key}
										nId={k.nId}
									/>
								</ItemGrid>
							else {
								return null
							}
						}
						) : null} */}
						{/* </ItemGrid> */}
						<ItemGrid xs={12} noMargin id="protocol">
							<SensorProtocol
								sensor={sensor}
							/>
						</ItemGrid>
						{renderDeleteDialog()}
					</GridContainer>
				</Fade>
			) : (renderLoader())}
		</Fragment>
	)
}

// const mapStateToProps = state => ({
// 	accessLevel: state.settings.user.privileges,
// 	language: state.settings.language,
// 	saved: state.favorites.saved,
// 	mapTheme: state.settings.mapTheme,
// 	periods: state.dateTime.periods,
// 	sensor: state.data.sensor,
// 	loading: !state.data.gotSensor
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: favObj => dispatch(isFav(favObj)),
// 	addToFav: favObj => dispatch(addToFav(favObj)),
// 	removeFromFav: favObj => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getSensor: async id => dispatch(await getSensorLS(id)),
// 	unassignSensor: () => dispatch(unassignSensor())
// })

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(withStyles(registryStyles)(Sensor))

export default Sensor