import { Caption, ItemG, Info, Link } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import Dropdown from 'components/Dropdown/Dropdown'
import React from 'react'
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, Block, CheckCircle, Delete } from 'variables/icons'
// import { connect } from 'react-redux'
import { useLocalization } from 'hooks'
import sensorsStyles from 'assets/jss/components/sensors/sensorsStyles'


const SensorDetails = (props) => {
	//Hooks
	const t = useLocalization()
	const classes = sensorsStyles()

	//Redux

	//State

	//Const
	const { sensor, isFav, addToFav, removeFromFav, handleOpenDeleteDialog, history } = props

	//useCallbacks

	//useEffects

	//Handlers
	const handleEditSensor = () => history.push({ pathname: `/sensor/${sensor.id}/edit`, prevURL: `/sensor/${sensor.id}` })

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
			title={sensor.name ? sensor.name : sensor.id}
			avatar={<DataUsage />}
			noExpand
			topAction={<Dropdown menuItems={
				[
					{ label: t('menus.edit'), icon: Edit, func: handleEditSensor },
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
					{ label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog }
				]
			} />

			}
			subheader={<ItemG container alignItems={'center'}>
				<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{sensor.id}
			</ItemG>}
			content={
				<ItemG container spacing={3}>
					<ItemG>
						<Caption>{t('registries.fields.protocol')}</Caption>
						<Info>{renderProtocol(sensor.protocol)}</Info>
					</ItemG>
					<ItemG xs>
						<Caption>{t('sensors.fields.communication')}</Caption>
						{renderCommunication(sensor.communication)}
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('registries.fields.registry')}</Caption>
						<Info>
							<Link to={{ pathname: `/registry/${sensor.regId}`, prevURL: `/sensor/${sensor.id}` }} >
								{sensor.regName}
							</Link>
						</Info>
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