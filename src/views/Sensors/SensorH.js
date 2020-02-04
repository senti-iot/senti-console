import { Fade } from "@material-ui/core"
// import registryStyles from "assets/jss/views/deviceStyles"
import {
	CircularLoader,
	GridContainer,
	ItemGrid,
	DeleteDialog
} from "components"
import React, { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { getWeather } from "variables/dataDevices"
// import moment from "moment"
import { DataUsage, InsertChart, Wifi } from "variables/icons"
import { isFav, addToFav, removeFromFav, finishedSaving } from "redux/favorites"
import { scrollToAnchor } from "variables/functions"
import { getSensorLS } from "redux/data"
import SensorDetails from "./SensorCards/SensorDetails"
import SensorProtocol from "./SensorCards/SensorProtocol"
import SensorMessages from "views/Charts/SensorMessages"
import { getSensorMessages } from "variables/dataSensors"
import { deleteSensor } from "variables/dataSensors"
import SensorChart from "views/Charts/SensorChart"
import { useLocalization, useSnackbar } from "hooks"
import { useRouteMatch, useHistory } from "react-router-dom"

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
	const [openDelete, setopenDelete] = useState(false)
	const [sensorMessages, setSensorMessages] = useState(null) // added
	//Const

	const getSensor = async id => {
		await dispatch(await getSensorLS(id))
	}
	useEffect(() => {
		if (sensor) {
			const tabs = () => {
				return [
					{ id: 0, title: t("tabs.details"), label: <DataUsage />, url: `#details` },
					{ id: 1, title: t("sidebar.messages"), label: <InsertChart />, url: `#messages` },
					{ id: 2, title: t("registries.fields.protocol"), label: <Wifi />, url: `#protocol` }
				]
			}

			props.setTabs({
				route: 0,
				id: "sensor",
				tabs: tabs(),
				hashLinks: true
			})
			props.setBC('sensor', sensor.name)

		}
	}, [props, sensor, t])
	useEffect(() => {
		const getSensors = async () => {
			if (props.match) {
				let id = props.match.params.id
				if (id) {
					await getSensor(id)
				}

				if (props.location.hash !== "") {
					scrollToAnchor(props.location.hash)
				}
			}
		}

		getSensors()
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

	const addToFavorites = () => {
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: "sensor",
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: "sensor",
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}
	const getDeviceMessages = async () => {
		await getSensorMessages(sensor.id, periods[0]).then(rs => {
			setSensorMessages(rs)
		})
	}
	const snackBarMessages = msg => {

		switch (msg) {
			case 1:
				return t('snackbars.deletedSuccess')
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
		if (isFavorite(sensor.id)) {
			removeFromFavorites()
		}
		await deleteSensor(sensor.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			history.push("/sensors/list")
		})
	}

	const renderDeleteDialog = () => {
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
												// gId={k}
												// dId={d.id}
												// color={d.color}
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