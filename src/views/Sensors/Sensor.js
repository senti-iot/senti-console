import { Fade, useTheme } from "@material-ui/core"
import {
	CircularLoader,
	GridContainer,
	ItemGrid,
	DeleteDialog
} from "components"
import React, { Fragment, useState, useEffect, useCallback } from "react"
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
import { useRouteMatch, useHistory, useLocation, useParams } from "react-router-dom"

const Sensor = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useRouteMatch()
	const params = useParams()
	const location = useLocation()
	const history = useHistory()
	const theme = useTheme()
	//Redux
	// const accessLevel = useSelector(s => s.settings.user.privileges)
	const saved = useSelector(state => state.favorites.saved)
	const periods = useSelector(state => state.dateTime.periods)
	const sensor = useSelector(state => state.data.sensor)
	const loading = useSelector(state => !state.data.gotSensor)
	//State
	const [openDelete, setopenDelete] = useState(false)
	const [sensorMessages, setSensorMessages] = useState(null)

	//Const
	const { setTabs, setBC, setHeader } = props

	//useCallbacks

	const getSensor = useCallback(async id => {
		await dispatch(await getSensorLS(id))
	}, [dispatch])

	//useEffects
	useEffect(() => {
		if (sensor) {
			const tabs = [
				{ id: 0, title: t("tabs.details"), label: <DataUsage />, url: `#details` },
				{ id: 1, title: t("sidebar.messages"), label: <InsertChart />, url: `#messages` },
				{ id: 2, title: t("registries.fields.protocol"), label: <Wifi />, url: `#protocol` }
			]
			setTabs({
				route: 0,
				id: "sensor",
				tabs: tabs,
				hashLinks: true
			})
			setBC('sensor', sensor.name)

			let prevURL = location.prevURL ? location.prevURL : `/sensors/list`
			setHeader('sidebar.device', true, prevURL, 'manage.sensors')
		}
	}, [location, sensor, setBC, setHeader, setTabs, t])

	useEffect(() => {
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
		//eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: sensor.uuid, type: "sensor" }))) {
				s("snackbars.favorite.saved", {
					name: sensor.name,
					type: t("favorites.types.device")
				})
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: sensor.uuid, type: "sensor" }))) {
				s("snackbars.favorite.removed", {
					name: sensor.name,
					type: t("favorites.types.device")
				})
				dispatch(finishedSaving())
			}
		}
	}, [dispatch, s, saved, sensor, t])

	//Handlers

	const isFavorite = (favObj) => dispatch(isFav(favObj))

	const addToFavorites = () => {
		let favObj = {
			id: sensor.uuid,
			name: sensor.name,
			type: "sensor",
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: sensor.uuid,
			name: sensor.name,
			type: "sensor",
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}
	/**
	 * @TODO
	 * Change ID to UUID
	 */
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
		if (isFavorite(sensor.uuid)) {
			removeFromFavorites()
		}
		await deleteSensor(sensor.uuid).then(() => {
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
								isFav={isFavorite({ id: sensor.uuid, type: "sensor" })}
								addToFav={addToFavorites}
								removeFromFav={removeFromFavorites}
								sensor={sensor}
								history={history}
								match={match}
								handleOpenDeleteDialog={handleOpenDeleteDialog}
							// handleOpenAssignDevice={handleOpenAssignDevice}
							// accessLevel={accessLevel}
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
						{sensor.dataKeys.map((k, i) => {

							return (
								<ItemGrid xs={12} key={i} container noMargin id={"charts" + i}>
									<SensorChart
										graphUnit={k.unit}
										deviceId={sensor.uuid}
										dataKey={k.key}
										title={k.label ? k.label : k.key}
										cfId={k.nId}
										chartColor={theme.palette.primary.main}
										single={true}
										t={t}
									/>
								</ItemGrid>
							)
						})}
						{/* {sensor.dataKeys ? sensor.dataKeys.map((k, i) => {
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
						}) : null} */}
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
						{/* <ItemGrid xs={12} container noMargin id={'charts'}>
							{sensor.dataKeys ? sensor.dataKeys.map((k, i) => {
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
							) : null}
						</ItemGrid> */}
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


export default Sensor