import React from 'react'
import { ItemG, Info, Dropdown } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { Edit, DeveloperBoard } from 'variables/icons'
import Caption from 'components/Typography/Caption';
import { useLocalization, useHistory } from 'hooks'


const DeviceHardware = React.memo(props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	//Redux

	//State

	//Const
	const { device } = props

	//useCallbacks

	//useEffects

	//Handlers

	return (
		<InfoCard
			title={t('devices.cards.hardware')}
			avatar={<DeveloperBoard />}
			subheader={''}
			haveMargin
			topAction={
				<Dropdown
					menuItems={[{ label: t('menus.edit'), icon: Edit, func: () => history.push(`${props.match.url}/edit-hardware`) }]} />
			}
			content={
				<ItemG container spacing={3}>
					<ItemG>
						<Caption>{t('devices.fields.RPImodel')}:</Caption>
						<Info>{device.RPImodel}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('devices.fields.memory')}:</Caption>
						<Info>{device.memory + ' - ' + device.memoryModel}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('devices.fields.adapter')}:</Caption>
						<Info>{device.adapter}</Info>
					</ItemG>

					<ItemG>
						<Caption>{t('devices.fields.wifiModule')}:</Caption>
						<Info>{device.wifiModule}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('devices.fields.modemModel')}:</Caption>
						<Info>{device.modemModel}</Info>
					</ItemG>

				</ItemG>
			}
			hiddenContent={<ItemG container spacing={3}>
				<ItemG>
					<Caption>{t('devices.fields.cellNumber')}:</Caption>
					<Info>{device.cellNumber}</Info>
				</ItemG>
				<ItemG>
					<Caption>{t('devices.fields.SIMProvider')}:</Caption>
					<Info>{device.SIMProvider}</Info>
				</ItemG>
				<ItemG>
					<Caption>{t('devices.fields.SIMID')}:</Caption>
					<Info>{device.SIMID}</Info>
				</ItemG>
				<ItemG>
					<Caption>{t('devices.fields.modemIMEI')}:</Caption>
					<Info>{device.modemIMEI}</Info>
				</ItemG>

			</ItemG>
			}
		/>
	)
})

export default DeviceHardware