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
						<Caption>{t('sensors.fields.protocols.externalAPI')}</Caption>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.protocols.http')} - {t('api.latest')}</Caption>
							<TextF
								id={'mqtt-state'}
								fullWidth
								label={''}
								readOnly
								value={`https://api.senti.cloud/{{API_TOKEN}}/registry/${registry.uuname}/latest`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/registry/${registry.uuname}/latest`)
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
								value={`https://api.senti.cloud/{{API_TOKEN}}/registry/${registry.uuname}/{{FROM_DATE}}/{{TO_DATE}}`}
								InputProps={{
									endAdornment:
										<ItemG>
											<IconButton onClick={() => {
												s('snackbars.urlCopied')
												copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/registry/${registry.uuname}/{{FROM_DATE}}/{{TO_DATE}}`)
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