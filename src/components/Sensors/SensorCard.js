import React from 'react'
import { Button } from '@material-ui/core'
import { SmallCard, ItemG, T, Link } from 'components'
import { Edit, InputIcon, Block, CheckCircle, DeviceHub } from 'variables/icons'
import { useHistory } from 'react-router-dom'
import { useLocalization } from 'hooks'
import Dropdown from 'components/Dropdown/Dropdown'
import sensorCardStyles from 'assets/jss/components/sensors/sensorCardStyles'
const SensorCard = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const classes = sensorCardStyles()
	//Redux

	//State

	//Const
	const { p, /* classes */ } = props

	//useCallbacks

	//useEffects

	//Handlers


	const renderCommunication = (val) => {
		switch (val) {
			case 0:
				return <ItemG container>
					<Block className={classes.blocked + ' ' + classes.icon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.blocked')}
					</T>
				</ItemG>
			case 1:
				return <ItemG container>
					<CheckCircle className={classes.allowed + ' ' + classes.icon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.allowed')}
					</T>
				</ItemG>
			default:
				break;
		}
	}

	const handleEditSensor = () => history.push({ pathname: `/sensor/${p.id}/edit`, prevURL: `/sensors/grid` })
	const handleGoToSensor = () => history.push({ pathname: `/sensor/${p.id}`, prevURL: `/sensors/grid` })
	return (
		<SmallCard
			avatar={< DeviceHub className={classes.bigIcon} />}
			key={p.id}
			title={p.name}
			subheader={p.uuid}
			topAction={
				<Dropdown menuItems={[
					{ label: t('menus.edit'), icon: Edit, func: handleEditSensor }
				]} />
			}
			content={< ItemG container >
				<ItemG xs={12}>
					<T className={classes.smallText} paragraph={false}>
						<InputIcon className={classes.icon} />
						<Link to={{ pathname: `/sensor/${p.reg_id}` }}>{p.reg_name}</Link>
					</T>
				</ItemG>
				<ItemG xs={12}>
					{renderCommunication(p.communication)}
				</ItemG>
			</ItemG >}
			rightActions={
				< Button variant={'text'} color={'primary'} onClick={handleGoToSensor}>
					{t('menus.seeMore')}
				</Button >
			}
		/>
	)
}

export default SensorCard
