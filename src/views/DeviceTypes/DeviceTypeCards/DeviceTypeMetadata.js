// import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { ItemG, Info } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import React from 'react'
import { StorageIcon } from 'variables/icons'
// import { useSelector } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useLocalization } from 'hooks'


const DeviceTypeMetadata = props => {
	//Hooks
	const t = useLocalization()

	//Redux

	//State

	//Const
	const { deviceType } = props
	let mtd = deviceType.metadata

	//useCallbacks

	//useEffects

	//Handlers

	return (
		<InfoCard
			title={t('sensors.fields.metadata')}
			avatar={<StorageIcon />}
			noExpand
			content={
				<ItemG container spacing={3}>
					<ItemG xs={12}>
						{mtd ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('cloudfunctions.fields.metadata.key')}</TableCell>
									<TableCell>{t('cloudfunctions.fields.metadata.defaultValue')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(mtd).map(s => {
									return <TableRow key={s}>
										<TableCell>
											{mtd[s].key}
										</TableCell>
										<TableCell>
											{mtd[s].value}
										</TableCell>
									</TableRow>
								})}
							</TableBody>
						</Table> : <Info>{t('no.metadata')}</Info>}
					</ItemG>
				</ItemG>} />
	)
}

export default DeviceTypeMetadata