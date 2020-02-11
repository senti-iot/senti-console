import React, { Fragment } from 'react'
import { Button, Divider, IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Close, CheckCircle, Block } from 'variables/icons';
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, InfoCard, T } from 'components'
import OpenStreetMap from 'components/Map/OpenStreetMap';
import Info from 'components/Typography/Info';
import AssignDeviceTypeDialog from 'components/AssignComponents/AssignDeviceTypeDialog';
import AssignRegistryDialog from 'components/AssignComponents/AssignRegistryDialog';
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog';
import { useLocalization } from 'hooks';
import createSensorStyles from 'assets/jss/components/sensors/createSensorStyles';


const CreateSensorForm = props => {
	//Hooks
	const t = useLocalization()
	const classes = createSensorStyles()

	//Redux

	//State

	//Const
	const CommunicationTypes = [
		{ value: 0, icon: <Block className={classes.blocked} />, label: t('sensors.fields.communications.blocked') },
		{ value: 1, icon: <CheckCircle className={classes.allowed} />, label: t('sensors.fields.communications.allowed') }
	]

	const LocationTypes = [
		{ value: 1, label: t('devices.locationTypes.pedStreet') },
		{ value: 2, label: t('devices.locationTypes.park') },
		{ value: 3, label: t('devices.locationTypes.path') },
		{ value: 4, label: t('devices.locationTypes.square') },
		{ value: 5, label: t('devices.locationTypes.crossroads') },
		{ value: 6, label: t('devices.locationTypes.road') },
		{ value: 7, label: t('devices.locationTypes.motorway') },
		{ value: 8, label: t('devices.locationTypes.port') },
		{ value: 9, label: t('devices.locationTypes.office') },
		{ value: 0, label: t('devices.locationTypes.unspecified') }
	]

	const outboundTypes = [
		{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
		// { value: 1, label: t('cloudfunctions.datatypes.average') }
	]
	//useCallbacks

	//useEffects

	//Handlers
	const { sensorMetadata, handleRemoveMtdKey, handleAddMetadataKey, handleChangeMetadata, handleChangeMetadataKey,
		handleChangeKey, handleOpenFunc, handleChangeType, cfunctions,
		handleRemoveKey, handleRemoveFunction, handleAddKey, handleOpenReg, openReg, handleCloseReg, handleChangeReg,
		handleOpenDT, handleCloseDT, openDT, handleChangeDT,
		openCF, handleCloseFunc, handleChangeFunc,
		handleChange, sensor, getLatLngFromMap,
		handleCreate, goToRegistries, select, handleAddInboundFunction, handleRemoveInboundFunction } = props

	const renderMetadata = () => {
		return <Fragment>
			<T variant={'subtitle1'}>{t('sensors.fields.metadata')}</T>
			{sensorMetadata.metadata.length > 0 ? sensorMetadata.metadata.map((m, i) => {
				return <ItemGrid xs={12} container key={'metadata' + i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.metadata.key')}
						onChange={handleChangeMetadataKey(i)}
						value={m.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						label={t('cloudfunctions.fields.metadata.value')}
						onChange={handleChangeMetadata(i)}
						value={m.value}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>
						<IconButton
							style={{ marginTop: 6 }}
							onClick={handleRemoveMtdKey(i)}>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>
			}) : null}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddMetadataKey} color={'primary'}>{t('actions.addMtdKey')}</Button>
			</ItemGrid>
			<T variant={'subtitle1'}>{t('sidebar.cloudfunctions')}</T>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={'outbound' + i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.key')}
						onChange={handleChangeKey(p, i)}
						value={p.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						label={t('sidebar.cloudfunction')}
						value={cfunctions.findIndex(f => f.id === p.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						onClick={handleOpenFunc(i, 'outbound')}
						onChange={() => { }}
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveFunction(i)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>,
							style: { marginRight: 8 }
						}}
					/>
					<DSelect
						onChange={handleChangeType(i)}
						value={p.type}
						menuItems={outboundTypes}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>

						<IconButton
							// className={classes.smallAction}
							style={{ marginTop: 6 }}
							onClick={handleRemoveKey(i)}
						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>

			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddKey} color={'primary'}>{t('actions.addKey')}</Button>
			</ItemGrid>
		</Fragment>
	}

	const renderMetadataInbound = () => {
		console.log(sensorMetadata)
		return <Fragment>
			{sensorMetadata.inbound.map((p, i) => {
				return <ItemGrid xs={12} key={'inbound' + i} container alignItems={'center'}>
					<TextF
						label={t("cloudfunctions.fields.inboundfunc")}
						onClick={handleOpenFunc(i, 'inbound')}
						value={cfunctions.findIndex(f => f.id === p.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveInboundFunction(i)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						}}
					/>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddInboundFunction} color={'primary'}>{t('actions.addInboundFunc')}</Button>
			</ItemGrid>

		</Fragment>

	}



	return (
		<GridContainer>
			<ItemGrid xs={12}>
				<InfoCard
					title={t('devices.fields.description')}
					noExpand
					noHeader
					content={
						<ItemG>

							<AssignCFDialog
								t={t}
								open={openCF.open}
								handleClose={handleCloseFunc}
								callBack={cf => {
									handleChangeFunc(cf, openCF.where)
									handleCloseFunc()
								}}
							/>
							{/* {this.renderSelectFunction()} */}
							<ItemGrid xs={12}>
								<TextF
									id={'sensorName'}
									label={t('devices.fields.name')}
									onChange={handleChange('name')}
									value={sensor.name}
									autoFocus
								/>

							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'sensorDescription'}
									label={t('devices.fields.description')}
									onChange={handleChange('description')}
									value={sensor.description}
									multiline
									rows={3}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* {this.renderSelectReg()} */}
								<AssignRegistryDialog
									t={t}
									open={openReg}
									handleClose={handleCloseReg}
									callBack={registry => {
										handleChangeReg(registry)
										handleCloseReg()
									}}
								/>
								<TextF
									id={'regID'}
									label={t('sensors.fields.registry')}
									value={select.reg.name}
									readOnly
									onClick={handleOpenReg}
									onChange={() => { }}
									InputProps={{
										onChange: handleOpenReg,
										readOnly: true
									}}
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								<AssignDeviceTypeDialog
									t={t}
									open={openDT}
									handleClose={handleCloseDT}
									callBack={deviceType => {
										handleChangeDT(deviceType)
										handleCloseDT()
									}}
								/>
								<TextF
									id={'deviceType'}
									label={t('sensors.fields.deviceType')}
									value={select.dt.name ? select.dt.name : ''}
									readOnly
									onClick={handleOpenDT}
									onChange={() => { }}
									InputProps={{
										onChange: handleOpenDT,
										readOnly: true
									}}
								/>
							</ItemGrid>
							{renderMetadata()}
							<Divider style={{ margin: "16px" }} />
							{renderMetadataInbound()}
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								{/* <ItemG xs={12}> */}
								<div style={{ height: 400 }}>
									<OpenStreetMap
										mapTheme={props.mapTheme}
										calibrate
										height={400}
										width={400}
										markers={[{ lat: sensor.lat ? sensor.lat : 56, long: sensor.lng ? sensor.lng : 9 }]}
										getLatLng={getLatLngFromMap}
									/>
								</div>
								{/* </ItemG> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								<Info>
									{`${sensor.lat} ${sensor.lng}`}
								</Info>
								<TextF
									id={'address'}
									label={t('devices.fields.address')}
									onChange={handleChange('address')}
									value={sensor.address}
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								<DSelect
									label={t('devices.fields.locType')}
									value={sensor.locType}
									onChange={handleChange('locType')}
									menuItems={LocationTypes}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DSelect
									label={t('sensors.fields.communication')}
									onChange={handleChange('communication')}
									value={sensor.communication}
									menuItems={CommunicationTypes}
								/>
							</ItemGrid>
							<ItemGrid container>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToRegistries}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
										{t('actions.save')}
									</Button>
								</div>
							</ItemGrid>
						</ItemG>
					}
				/>
			</ItemGrid>
		</GridContainer>

	)
}


export default CreateSensorForm