import { IconButton } from '@material-ui/core';
import { Caption, ItemG, TextF } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import React from 'react';
// import { Link } from 'react-router-dom';
import { Wifi, ContentCopy, /* Delete */ } from 'variables/icons';
import { copyToClipboard } from 'variables/functions';
import { useLocalization, useSnackbar } from 'hooks';
// import deviceStyles from 'assets/jss/components/devices/deviceStyles';

//Hooks

//Redux

//State

//Const


const SensorProtocol = (props) => {
	//Hooks
	// const classes = deviceStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	//Redux

	//State

	//Const
	const { sensor } = props



	// TODO
	// const detailsPanel = useSelector(state => state.settings.detailsPanel)

	// TODO
	// const registryState = () => {
	// 	const { registry, t } = props
	// 	switch (registry.state) {
	// 		case 1:
	// 			return t('registries.fields.state.active')
	// 		case 2:
	// 			return t('registries.fields.state.inactive')
	// 		default:
	// 			break;
	// 	}
	// }
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
				break;
		}
	}
	// TODO
	// const renderCommunication = (val) => {
	// 	const { t, classes } = props
	// 	switch (val) {
	// 		case 0:
	// 			return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
	// 		case 1:
	// 			return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
	// 		default:
	// 			break;
	// 	}
	// }

	return (
		<InfoCard
			title={t('registries.fields.protocol')}
			avatar={<Wifi />}
			noExpand
			subheader={<ItemG container alignItems={'center'}>
				<Caption>{renderProtocol(sensor.protocol)}</Caption>
			</ItemG>}
			content={
				<ItemG container spacing={3}>
					<ItemG xs={12}>
						<Caption>{t('sensors.fields.protocols.publishData')}</Caption>
						{sensor.protocol === 1 || sensor.protocol === 3 ? <ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.mqtt')}</Caption>
							<TextF
								id={'mqtt-publish'}
								fullWidth
								readOnly
								label={''}
								value={`v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}}
							/>
						</ItemG> : null}
						{sensor.protocol === 2 || sensor.protocol === 3 ? <ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} POST</Caption>
							<TextF
								id={'htpp-publish'}
								fullWidth
								label={''}
								readOnly
								value={`https://iotdevice.senti.cloud/v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}
								}
							/>
						</ItemG> : null}
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('sensors.fields.protocols.state')}</Caption>
						{sensor.protocol === 1 || sensor.protocol === 3 ? <ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.mqtt')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}
								}
							/>
						</ItemG> : null}
						{sensor.protocol === 2 || sensor.protocol === 3 ? <ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')}</Caption>
							<TextF
								id={'http-state'}
								fullWidth
								readOnly
								value={`https://iotdevice.senti.cloud/v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}
								}
							/>
						</ItemG> : null}
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('sensors.fields.protocols.externalAPI')}</Caption>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`{{API_TOKEN_HERE}}/devicedata/${sensor.uuid}/{{FROM_DATE}}/{{TO_DATE}}/{{DATA_KEY}}/?{{CLOUD_FUNCTION_ID}}`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`v1/${sensor.customer_uuid}/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}
								}
							/>
						</ItemG>
					</ItemG>
				</ItemG>
			}
		/>
	)
}

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

export default SensorProtocol