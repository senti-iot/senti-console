import React, { Fragment } from 'react'
import { Button, Divider, Tooltip, IconButton, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment } from '@material-ui/core'
import { CheckCircle, Block, Close } from 'variables/icons'
import { GridContainer, ItemGrid, TextF, ItemG, DSelect, InfoCard, T } from 'components'
import OpenStreetMap from 'components/Map/OpenStreetMap'
import Info from 'components/Typography/Info'
import AssignDeviceTypeDialog from 'components/AssignComponents/AssignDeviceTypeDialog'
import AssignRegistryDialog from 'components/AssignComponents/AssignRegistryDialog'
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog'
import { useLocalization } from 'hooks'
import createSensorStyles from 'assets/jss/components/sensors/createSensorStyles'


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


	//useCallbacks

	//useEffects

	//Handlers
	/* To remove from props
		const outboundTypes = [
		{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
		// { value: 1, label: t('cloudfunctions.datatypes.average') }
	]
	openCF, handleCloseFunc, handleChangeFunc,
	handleRemoveMtdKey, handleAddMetadataKey, handleChangeMetadata, handleChangeMetadataKey,
	handleRemoveKey, handleRemoveFunction, handleAddKey,
	handleChangeKey, handleOpenFunc, handleChangeType,
	handleAddInboundFunction, handleRemoveInboundFunction
*/
	const { sensorMetadata, sensorDataKeys, sensorDecoder,
		cfunctions,
		handleOpenReg, openReg, handleCloseReg, handleChangeReg,
		handleOpenDT, handleCloseDT, openDT, handleChangeDT,
		handleRemoveMtdKey, handleAddMetadataKey, handleChangeMetadata, handleChangeMetadataKey,
		handleChange, sensor, getLatLngFromMap,
		handleCreate, goToSensors, select, handleChangeSyntheticKeyConversionFactor } = props
	/**
	 * Syntehtic Fields
	 */
	const { sensorSyntheticKeys,
		handleAddSyntheticKey,
		handleRemoveSyntheticKey,
		handleChangeSyntheticKeyUnit,
		handleChangeSyntheticKeyLabel,
		handleChangeSyntheticKey,
		handleChangeSyntheticKeyType,
		handleChangeSyntheticKeyOrigin
	} = props

	const { openCF, handleCloseFunc, handleChangeFunc,
		 handleRemoveFunction,
		 handleOpenFunc,
		 } = props

	const renderSyntheticKeys = () => {
		return <Fragment>
			{sensorSyntheticKeys.map((p, i) => {
				// console.log(p)
				return <ItemGrid xs={12} container key={i + 'outbound'} alignItems={'center'} justifyContent={'center'}>
					<TextF
						id={'outbound-label' + i}
						label={t('sensors.fields.dataKeyName')}
						value={p.label}
						onChange={handleChangeSyntheticKeyLabel(p, i)}
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-key' + i}
						label={t('sensors.fields.dataSynthetic')}
						onChange={handleChangeSyntheticKey(p, i)}
						value={p.key}
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-unit' + i}
						label={t('dashboard.fields.unit')}
						value={p.unit}
						onChange={handleChangeSyntheticKeyUnit(p, i)}
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-conversionFactor' + i}
						label={t('dashboard.fields.conversionFactor')}
						value={p.conversionFactor}
						onChange={handleChangeSyntheticKeyConversionFactor(p, i)}
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-value' + i}
						label={t('sidebar.cloudfunction')}
						value={cfunctions.findIndex(f => f.id === p.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						onClick={handleOpenFunc(i, 'synthetic')}
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
						onChange={handleChangeSyntheticKeyType(i)}
						label={t('cloudfunctions.datatypes.datatype')}
						value={p.type}
						margin={'normal'}
						style={{ marginRight: 8 }}
						menuItems={[
							{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
							// { value: 1, label: t('cloudfunctions.datatypes.average') }
						]}
					/>
					{p.originalKey !== undefined ?
						<DSelect
							onChange={handleChangeSyntheticKeyOrigin(i)}
							label={t('cloudfunctions.fields.key')}
							value={p.originalKey}
							margin={'normal'}
							style={{ marginRight: 8 }}
							// menuItems={[
							// 	{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
							// 	// { value: 1, label: t('cloudfunctions.datatypes.average') }
							// ]}
							menuItems={sensorDataKeys.map((p, i) => p.originalKey === undefined ? ({ value: p.key, label: p.key }) : ({ dontShow: true }))}
						/> : null
					}
					<Tooltip title={t('tooltips.devices.removeDataField')}>

						<IconButton
							// className={classes.smallAction}
							style={{ marginTop: 6 }}
							onClick={handleRemoveSyntheticKey(i)}
						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>

			})}
			<ItemG xs={12} container>

				<ItemGrid>
					<Button variant={'outlined'} disabled={sensorDataKeys.length === 0} onClick={handleAddSyntheticKey} color={'primary'}>{t('actions.addSyntheticKey')}</Button>
				</ItemGrid>
			</ItemG>
		</Fragment>
	}
	const renderMetadata = () => {
		return <Fragment>
			<T style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('sensors.fields.metadata')}</T>
			{sensorMetadata.length > 0 ? sensorMetadata.map((m, i) => {
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
			<Divider style={{ margin: "16px" }} />
			<T style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('sensors.fields.dataKeys')}</T>
			{sensorDataKeys.length > 0 ? <Table>
				<TableHead>
					<TableRow style={{ paddingLeft: 24 }}>
						<TableCell style={{ paddingLeft: 24 }}>
							{t('sensors.fields.dataKey')}
						</TableCell>
						<TableCell>
							<ItemG container>
								{/* <SignalWifi2Bar style={{ marginRight: 8 }} /> */}
								{t('sidebar.cloudfunctions')}
							</ItemG>

						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{ sensorDataKeys.map(d => {
						return (
							<TableRow key={d.uuid}>
								<TableCell style={{ paddingLeft: 24 }} component="th" scope="row">
									{d.key}
								</TableCell>
								<TableCell component="th" scope="row">
									{cfunctions.findIndex(f => f.id === d.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === d.nId)].name : t('no.cloudfunction')}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table> : null}
			<Divider style={{ margin: "16px" }} />
			<T style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('sensors.fields.decoder')}</T>
			{sensorDecoder.length > 0 ? <Table>
				<TableHead>
					<TableRow style={{ paddingLeft: 24 }}>
						<TableCell style={{ paddingLeft: 24 }}>
							<ItemG container>
								{t('sidebar.cloudfunctions')}
							</ItemG>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sensorDecoder.map(d => {
						return (
							<TableRow key={d.uuid}>
								<TableCell style={{ paddingLeft: 24 }} component="th" scope="row">
									{cfunctions.findIndex(f => f.id === d.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === d.nId)].name : t('no.cloudfunction')}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table> : null}
			{/* <T style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('sidebar.cloudfunctions')}</T>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={'outbound' + i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.key')}
						// onChange={handleChangeKey(p, i)}
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
						// onClick={handleOpenFunc(i, 'outbound')}
						onChange={() => { }}
						InputProps={{
							// endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
							// 	<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
							// 		<IconButton
							// 			className={classes.smallAction}
							// 			onClick={e => { e.stopPropagation(); handleRemoveFunction(i)() }}
							// 		>
							// 			<Close />
							// 		</IconButton>
							// 	</Tooltip>
							// </InputAdornment>,
							style: { marginRight: 8 }
						}}
					/>
					// <DSelect
					// 	readOnly
					// 	onChange={handleChangeType(i)}
					// 	value={p.type}
					// 	menuItems={outboundTypes}
					// />
					// <Tooltip title={t('tooltips.devices.removeDataField')}>

					// 	<IconButton
					// 		// className={classes.smallAction}
					// 		style={{ marginTop: 6 }}
					// 		onClick={handleRemoveKey(i)}
					// 	>
					// 		<Close />
					// 	</IconButton>
					// </Tooltip>
				</ItemGrid>

			})} */}
			{/* <ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddKey} color={'primary'}>{t('actions.addKey')}</Button>
			</ItemGrid> */}
		</Fragment>
	}

	// const renderMetadataInbound = () => {
	// 	return null
	// t('actions.addInboundFunc')
	// return <Fragment>
	// 	<T style={{ marginLeft: 16 }} variant={'subtitle1'}>{t('cloudfunctions.fields.types.inbound')}</T>
	// 	{sensorMetadata.inbound.map((p, i) => {
	// 		return <ItemGrid xs={12} key={'inbound' + i} container alignItems={'center'}>
	// 			<TextF
	// 				label={t("cloudfunctions.fields.inboundfunc")}
	// 				// onClick={handleOpenFunc(i, 'inbound')}
	// 				value={cfunctions.findIndex(f => f.id === p.nId) > -1 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
	// 				readOnly
	// 			// InputProps={{
	// 			// 	endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
	// 			// 		<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
	// 			// 			<IconButton
	// 			// 				className={classes.smallAction}
	// 			// 				onClick={e => { e.stopPropagation(); handleRemoveInboundFunction(i)() }}
	// 			// 			>
	// 			// 				<Close />
	// 			// 			</IconButton>
	// 			// 		</Tooltip>
	// 			// 	</InputAdornment>
	// 			// }}
	// 			/>
	// 		</ItemGrid>
	// 	})}
	// 	{/* <ItemGrid xs={12}>
	// 		<Button variant={'outlined'} onClick={handleAddInboundFunction} color={'primary'}>{t('actions.addInboundFunc')}</Button>
	// 	</ItemGrid> */}

	// </Fragment>

	// }

	const testUuname = () => {
		if (sensor.uuname.length > 0) {
			if (sensor.uuname.includes(' '))
				return true
		}
		return false
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
									error={testUuname()}
									id={'sensorUuname'}
									label={t('devices.fields.uuname')}
									onChange={handleChange('uuname')}
									value={sensor.uuname}
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
							<Divider style={{ margin: "16px" }} />
							{renderMetadata()}
							<Divider style={{ margin: "16px" }} />
							{renderSyntheticKeys()}
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								{/* <ItemG xs={12}> */}
								<div style={{ height: 400 }}>
									<OpenStreetMap
										mapTheme={props.mapTheme}
										calibrate
										height={400}
										width={400}
										markers={[{ lat: sensor.lat ? sensor.lat : 56, long: sensor.lon ? sensor.lon : 9 }]}
										getLatLng={getLatLngFromMap}
									/>
								</div>
								{/* </ItemG> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								<Info>
									{`${sensor.lat ? sensor.lat : ""} ${sensor.lon ? sensor.lon : ""}`}
								</Info>
								<TextF
									id={'address'}
									label={t('devices.fields.address')}
									onChange={handleChange('address')}
									value={sensor.address ? sensor.address : ""}
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								<DSelect
									label={t('devices.fields.locType')}
									value={parseInt(sensor.locType)}
									onChange={handleChange('locType')}
									menuItems={LocationTypes}
									margin={'normal'}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DSelect
									margin={'normal'}
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
										onClick={goToSensors}
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