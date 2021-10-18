import { IconButton } from '@material-ui/core'
import { Caption, ItemG, TextF } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import React from 'react'
import { Wifi, ContentCopy } from 'variables/icons'
import { copyToClipboard } from 'variables/functions'
import { useLocalization, useSnackbar } from 'hooks'


const SensorProtocol = (props) => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	//Redux

	//State

	//Const
	const { sensor } = props


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

						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.mqtt')}</Caption>
							<TextF
								id={'mqtt-publish'}
								fullWidth
								readOnly
								label={''}
								value={`v1/${sensor?.registry?.org?.uuname}/location/europe/registries/${sensor?.registry?.uuname}/devices/${sensor?.uuname}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`v1/${sensor?.registry?.org?.uuname}/location/europe/registries/${sensor?.registry?.uuname}/devices/${sensor?.uuname}/publish`)
											}
											}>
												<ContentCopy />
											</IconButton>
										</ItemG>
								}}
							/>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} POST</Caption>
							<TextF
								id={'htpp-publish'}
								fullWidth
								label={''}
								readOnly
								value={`https://iotdevice.senti.cloud/v1/${sensor?.registry?.org?.uuname}/location/europe/registries/${sensor?.registry?.uuname}/devices/${sensor?.uuname}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/${sensor?.registry?.org?.uuname}/location/europe/registries/${sensor?.registry?.uuname}/devices/${sensor?.uuname}/publish`)
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
					<ItemG xs={12}>
						<Caption>{t('sensors.fields.protocols.externalAPI')}</Caption>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} - {t('api.latest')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`https://services.senti.cloud/databroker/{{API_TOKEN}}/devicedata/${sensor.uuid}/latest`}
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
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} - {t('api.period')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`https://services.senti.cloud/databroker/{{API_TOKEN}}/devicedata/${sensor.uuid}/{{FROM_DATE}}/{{TO_DATE}}`}
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
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} - {t('api.periodField')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`https://services.senti.cloud/databroker/{{API_TOKEN}}/devicedata/${sensor.uuid}/{{FROM_DATE}}/{{TO_DATE}}/{{DATA_FIELD}}/?{{CLOUD_FUNCTION_ID}}`}
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


export default SensorProtocol