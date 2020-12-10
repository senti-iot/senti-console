import { IconButton } from '@material-ui/core'
import { Caption, ItemG, TextF } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import React from 'react'
import { Wifi, ContentCopy } from 'variables/icons'
import { copyToClipboard } from 'variables/functions'
import { useLocalization, useSnackbar } from 'hooks'


const RegistryProtocol = (props) => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	//Redux

	//State

	//Const
	const { registry } = props


	return (
		<InfoCard
			title={t('registries.fields.protocol')}
			avatar={<Wifi />}
			noExpand
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
								//v1/climaid-9143be4c/location/europe/registries/climaid-413ee13f/publish
								value={`v1/${registry?.org?.uuname}/location/europe/registries/${registry?.uuname}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`v1/${registry?.org?.uuname}/location/europe/registries/${registry?.uuname}/publish`)
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
								value={`https://iotdevice.senti.cloud/v1/${registry?.org?.uuname}/location/europe/registries/${registry?.uuname}/publish`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/${registry?.org?.uuname}/location/europe/registries/${registry?.uuname}/publish`)
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


export default RegistryProtocol