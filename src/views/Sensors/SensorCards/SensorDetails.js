import { Caption, ItemG, Info, Link } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import Dropdown from 'components/Dropdown/Dropdown'
import React from 'react'
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, Block, CheckCircle, Delete } from 'variables/icons'
// import { connect } from 'react-redux'
import { useLocalization, useAuth, useSelector } from 'hooks'
import sensorsStyles from 'assets/jss/components/sensors/sensorsStyles'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { Check } from '@material-ui/icons'


const SensorDetails = (props) => {
	//Hooks
	const t = useLocalization()
	const classes = sensorsStyles()
	const Auth = useAuth()
	const hasAccess = Auth.hasAccess

	//Redux
	const cfunctions = useSelector(state => state.data.functions)


	//State

	//Const
	const { sensor, isFav, addToFav, removeFromFav, handleOpenDeleteDialog, history } = props
	let dataKeys = sensor.dataKeys ? sensor.dataKeys.map(k => ({ ...k, dt: true })) : []
	let syntheticKeys = sensor.syntheticKeys ? sensor.syntheticKeys.map(k => k) : []
	let allKeys = [...syntheticKeys, ...dataKeys]
	//useCallbacks

	//useEffects

	//Handlers
	const handleEditSensor = () => history.push({ pathname: `/sensor/${sensor.uuid}/edit`, prevURL: `/sensor/${sensor.uuid}` })

	const renderProtocol = (id) => {
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1:
				return t('registries.fields.protocols.mqtt')
			case 2:
				return t('registries.fields.protocols.http')
			case 3:
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break
		}
	}
	const renderCommunication = (val) => {
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> <Info>{t('sensors.fields.communications.blocked')}</Info></ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> <Info>{t('sensors.fields.communications.allowed')}</Info></ItemG>
			default:
				break
		}
	}

	return (
		<InfoCard
			title={sensor.name ? sensor.name : sensor.uuid}
			avatar={<DataUsage />}
			noExpand
			topAction={<Dropdown menuItems={
				[
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
					{ isDivider: true },
					{ disabled: !hasAccess(sensor.uuid, 'device.modify' ), label: t('menus.edit'), icon: Edit, func: handleEditSensor },
					{ disabled: !hasAccess(sensor.uuid, 'device.delete' ), label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog }
				]
			} />

			}
			subheader={<ItemG container alignItems={'center'}>
				<ItemG xs={12}>
					<Caption>{t('registries.fields.uuid')}:</Caption>&nbsp;{sensor.uuid}
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('devices.fields.uuname')}:</Caption>&nbsp;{sensor.uuname}
				</ItemG>
			</ItemG>}
			content={
				<ItemG container spacing={3}>
					<ItemG xs={12}>
						<Caption>{t('devices.fields.description')}</Caption>
						<Info>{sensor.description}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('registries.fields.protocol')}</Caption>
						<Info>{sensor.registry ? renderProtocol(sensor.registry.protocol) : ""}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('sensors.fields.communication')}</Caption>
						{sensor.communication ? renderCommunication(sensor.communication) : ""}
					</ItemG>
					<ItemG>
						<Caption>{t('sensors.fields.deviceType')}</Caption>
						<Info>
							<Link to={{ pathname: `/devicetype/${sensor.deviceType.uuid}`, prevURL: `/sensor/${sensor.uuid}` }}>
								{sensor.deviceType?.name}
							</Link>
						</Info>
					</ItemG>
					<ItemG xs>
						<Caption>{t('registries.fields.registry')}</Caption>
						<Info>
							<Link to={{ pathname: `/registry/${sensor.registry.uuid}`, prevURL: `/sensor/${sensor.uuid}` }} >
								{sensor.registry?.name}
							</Link>
						</Info>
					</ItemG>
					<ItemG xs={12}>
						{sensor.metadata?.length > 0 ? <Table>
							<TableHead>
								<TableRow style={{}}>
									<TableCell style={{}}>
										{t('sensors.fields.dataKeys')}
									</TableCell>
									<TableCell>
										<ItemG container>
											{t('sidebar.cloudfunctions')}
										</ItemG>

									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sensor.metadata.map(d => {
									let cf = cfunctions.findIndex(f => f.id === d.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === d.nId)] : null
									return (
										<TableRow key={d.uuid}>
											<TableCell style={{}} component="th" scope="row">
												{d.key}
											</TableCell>
											<TableCell component="th" scope="row">
												{cf ?
													<Link to={{ pathname: `/function/${cf.uuid}`, prevURL: `/sensor/${sensor.uuid}` }}>
														{cf.name}
													</Link>
													: t('no.cloudfunction')}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table> : null}
					</ItemG>
					<ItemG xs={12}>
						{/* <Divider style={{ margin: "16px" }} /> */}
						{/* <Caption style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('sensors.fields.dataKeys')}</Caption> */}
						{allKeys?.length > 0 ? <Table>
							<TableHead>
								<TableRow style={{  }}>
									<TableCell style={{  }}>
										{t('sensors.fields.dataKeys')}
									</TableCell>
									<TableCell>
										<ItemG container>
											{t('sidebar.cloudfunctions')}
										</ItemG>
									</TableCell>
									<TableCell>
										{t('sensors.fields.dataKeysInherited')}
									</TableCell>
									<TableCell>
										{t('cloudfunctions.fields.synthetic')}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{allKeys.map(d => {
									let cf = cfunctions.findIndex(f => f.id === d.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === d.nId)] : null
									return (
										<TableRow key={d.uuid}>
											<TableCell style={{ }} component="th" scope="row">
												{d.key}
											</TableCell>
											<TableCell component="th" scope="row">
												{cf ?
													<Link to={{ pathname: `/function/${cf.uuid}`, prevURL: `/sensor/${sensor.uuid}` }}>
														{cf.name}
													</Link>
											 : t('no.cloudfunction')}
											</TableCell>
											<TableCell>
												{d.dt ? <Check style={{ fontSize: 14 }} /> : '-'}
											</TableCell>
											<TableCell>
												{d.originalKey ? <Check style={{ fontSize: 14 }} /> : ''}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table> : null}
					</ItemG>
					<ItemG xs={12}>

						{/* <Divider style={{ margin: "16px" }} /> */}
						{sensor.decoder?.length > 0 ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<ItemG container>
											{t('sensors.fields.decoder')}
										</ItemG>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sensor.decoder.map(d => {
									let cf = cfunctions.findIndex(f => f.id === d.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === d.nId)] : null
									return (
										<TableRow key={d.uuid}>
											<TableCell component="th" scope="row">
												{cf ?
													<Link to={{ pathname: `/function/${cf.uuid}`, prevURL: `/sensor/${sensor.uuid}` }}>
														{cf.name}
													</Link>
													: t('no.cloudfunction')}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table> : null}
					</ItemG>
				</ItemG>
			}
		/>
	)
}

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

export default SensorDetails