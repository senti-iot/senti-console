import React, { Fragment, } from 'react'
import { Button, Divider, IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import { GridContainer, ItemGrid, TextF, ItemG, InfoCard, T, DSelect } from 'components'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
import { useLocalization } from 'hooks'
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog';
import createSensorStyles from 'assets/jss/components/sensors/createSensorStyles';


//@Andrei
const CreateDeviceTypeForm = props => {
	//Hooks
	const t = useLocalization()
	const classes = createSensorStyles()
	//Redux

	//State

	//Const
	const { sensorMetadata, cfunctions, handleAddInboundFunction, handleOpenFunc, handleRemoveInboundFunction,
		handleRemoveMtdKey, handleAddMetadataKey, handleChangeMetadata, handleChangeMetadataKey,
		handleChangeKey, handleRemoveKey, handleRemoveFunction,
		handleAddKey, openCF, handleCloseFunc, handleChangeFunc, handleChange, org, handleOrgChange, deviceType,
		handleCreate, goToDeviceTypes, handleChangeType, handleCloseOrg, handleOpenOrg,
		openOrg } = props


	//useCallbacks

	//useEffects

	//Handlers


	const renderMetadata = () => {
		return <Fragment>
			<T variant={'subtitle1'}>{t('sensors.fields.metadata')}</T>
			{sensorMetadata.metadata.map((m, i) => {
				return <ItemGrid xs={12} container key={i} alignItems={'center'}>
					<TextF
						id={'metadata-key' + i}
						label={t('cloudfunctions.fields.metadata.key')}
						onChange={handleChangeMetadataKey(i)}
						value={m.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'metadata-value' + i}
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
							onClick={handleRemoveMtdKey(i)}						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddMetadataKey} color={'primary'}>{t('actions.addMtdKey')}</Button>
			</ItemGrid>
			<T variant={'subtitle1'}>{t('sidebar.cloudfunctions')}</T>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={i + 'outbound'} alignItems={'center'}>
					<TextF
						id={'outbound-key' + i}
						label={t('cloudfunctions.fields.key')}
						onChange={handleChangeKey(p, i)}
						value={p.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						id={'outbound-value' + i}
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
						menuItems={[
							{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
							{ value: 1, label: t('cloudfunctions.datatypes.average') }
						]}
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
		return <Fragment>
			{sensorMetadata.inbound.map((p, i) => {
				return <ItemGrid key={i + "inbound"} xs={12} container alignItems={'center'}>
					<TextF
						id={'inbound-function' + i}
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
					noHeader
					noExpand
					content={<ItemG>
						<AssignCFDialog
							t={t}
							open={openCF.open}
							handleClose={handleCloseFunc}
							callBack={cf => {
								handleChangeFunc(cf, openCF.where)
								handleCloseFunc()
							}}
						/>
						<ItemGrid xs={12}>
							<TextF
								id={'deviceTypeName'}
								label={t('collections.fields.name')}
								onChange={handleChange('name')}
								value={deviceType.name}
							// autoFocus
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'dtDescription'}
								label={t('devices.fields.description')}
								onChange={handleChange('description')}
								value={deviceType.description}
								multiline
								rows={3}
							/>
						</ItemGrid>
						<Divider style={{ margin: "16px" }} />
						{renderMetadata()}
						<Divider style={{ margin: "16px" }} />
						{renderMetadataInbound()}
						<Divider style={{ margin: "16px" }} />
						<ItemGrid xs={12}>
							<TextF
								id={'org'}
								value={org.name}
								onClick={handleOpenOrg}
								readonly
							/>
							<AssignOrgDialog
								t={t}
								open={openOrg}
								handleClose={handleCloseOrg}
								callBack={org => { handleOrgChange(org); handleCloseOrg() }}
							/>
						</ItemGrid>
						<Divider style={{ margin: "16px" }} />
						<ItemGrid container>
							<div className={classes.wrapper}>
								<Button
									variant='outlined'
									onClick={goToDeviceTypes}
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
					</ItemG>}
				/>
			</ItemGrid>

		</GridContainer>
	)
}


export default CreateDeviceTypeForm