import { ItemG, CircularLoader, Info, Link } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import React from 'react'
import { CloudUpload } from 'variables/icons'
import { useSelector } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useLocalization } from 'hooks'


const DeviceTypeCloudFunctions = props => {
	//Hooks
	const t = useLocalization()

	//Redux
	const cloudfunctions = useSelector(state => state.data.functions)
	const loading = useSelector(state => !state.data.gotfunctions)

	//State

	//Const
	const { deviceType } = props
	let cfi = deviceType.inbound
	let cfo = deviceType.outbound
	let cf = cloudfunctions

	//useCallbacks

	//useEffects

	//Handlers


	const renderType = (type) => {
		// const { t } = this.props
		switch (type) {
			case 0:
				return t('cloudfunctions.datatypes.timeSeries')
			case 1:
				return t('cloudfunctions.datatypes.average')
			default:
				break
		}
	}

	return (
		<InfoCard
			title={t('sidebar.cloudfunctions')}
			avatar={<CloudUpload />}
			noExpand
			content={
				loading ? <CircularLoader /> : <ItemG container spacing={3}>
					<ItemG xs={12}>
						<Info>{t('cloudfunctions.fields.inboundfunc')}</Info>
						{cfi ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('cloudfunctions.fields.types.inbound')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cfi.map((s, i) => {
									return <TableRow key={i + 'outbound'}>
										<TableCell>
											<Link to={{ pathname: `/function/${s.nId}`, prevURL: `/devicetype/${deviceType.id}` }}>
												{cf[cf.findIndex(f => f.id === s.nId)] ? cf[cf.findIndex(f => f.id === s.nId)].name : s.nId}
											</Link>
										</TableCell>

									</TableRow>
								})}
							</TableBody>
						</Table> : <Info>{t('no.deviceInboundFunc')}</Info>}
					</ItemG>
					<ItemG xs={12}>
						<Info>{t('cloudfunctions.fields.keys')}</Info>
						{cfo ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('cloudfunctions.fields.key')}</TableCell>
									<TableCell>{t('cloudfunctions.fields.types.outbound')}</TableCell>
									<TableCell>{t('cloudfunctions.fields.type')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cfo.map((s, i) => {
									return <TableRow key={i + 'inbound'}>
										<TableCell>
											{s.key}
										</TableCell>
										<TableCell>
											{s.nId > 0 ? <Link to={{ pathname: `/function/${s.nId}`, prevURL: `/devicetype/${deviceType.id}` }}>
												{cf[cf.findIndex(f => f.id === s.nId)].name}
											</Link> : '-'}
										</TableCell>
										<TableCell>
											{renderType(s.type)}
										</TableCell>
									</TableRow>
								})}
							</TableBody>
						</Table> : <Info>{t('no.deviceDataKeys')}</Info>}
					</ItemG>
				</ItemG>} />)
}

export default DeviceTypeCloudFunctions