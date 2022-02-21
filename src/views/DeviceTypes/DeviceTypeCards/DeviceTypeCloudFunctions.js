import { ItemG, CircularLoader, Info, Link } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import React from 'react'
import { Check, CloudUpload } from 'variables/icons'
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
	const cf = useSelector(state => state.data.functions)
	const loading = useSelector(state => !state.data.gotfunctions)

	//State

	//Const
	const { deviceType } = props
	let cfi = deviceType.inbound
	console.log(cfi)
	let cfo = deviceType.outbound
	let cfm = Array.isArray(deviceType.metadata) ? deviceType.metadata : Object.entries(deviceType.metadata).map(o => ({ "key": o[0], "value": o[1] }))

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
						<Info>{t('devicetypes.fields.decoder')}</Info>
						{deviceType.decoder ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('cloudfunctions.fields.types.decoder')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow >
									<TableCell>
										<Link to={{ pathname: `/function/${cf[cf.findIndex(f => f.id === deviceType.decoder)].uuid}`, prevURL: `/devicetype/${deviceType.uuid}` }}>
											{cf[cf.findIndex(f => f.id === deviceType.decoder)]?.name}
										</Link>
									</TableCell>

								</TableRow>

							</TableBody>
						</Table>
							: <Info>{t('no.cloudfunction')}</Info>}
					</ItemG>
					<ItemG xs={12}>
						<Info>{t('cloudfunctions.fields.inboundfunc')}</Info>
						{cfi.length > 0 ?
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('cloudfunctions.fields.types.inbound')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cfi.map((s, i) => {
										return <TableRow key={i + 'outbound'}>
											<TableCell>
												<Link to={{ pathname: `/function/${cf[cf.findIndex(f => f.id === s.nId)].uuid}`, prevURL: `/devicetype/${deviceType.uuid}` }}>
													{cf[cf.findIndex(f => f.id === s.nId)]?.name}
												</Link>
											</TableCell>

										</TableRow>
									})}
								</TableBody>
							</Table>

							: <Info>{t('no.deviceInboundFunc')}</Info>}
					</ItemG>

					<ItemG xs={12}>
						<Info>{t('cloudfunctions.fields.keys')}</Info>
						{cfo.length > 0 ?
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('cloudfunctions.fields.key')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.types.outbound')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.type')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.synthetic')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cfo.map((s, i) => {
										return <TableRow key={i + 'inbound'}>
											<TableCell>
												{s.key}
											</TableCell>
											<TableCell>
												{s.nId > 0 ? <Link to={{ pathname: `/function/${cf[cf.findIndex(f => f.id === s.nId)].uuid}`, prevURL: `/devicetype/${deviceType.id}` }}>
													{cf[cf.findIndex(f => f.id === s.nId)]?.name}
												</Link> : '-'}
											</TableCell>
											<TableCell>
												{renderType(s.type)}
											</TableCell>
											<TableCell>
												{s.originalKey ? <Check style={{ fontSize: 14 }}/> : ''}
											</TableCell>
										</TableRow>
									})}
								</TableBody>
							</Table>
							: <Info>{t('no.deviceDataKeys')}</Info>}
					</ItemG>


					<ItemG xs={12}>
						<Info>{t('devicetypes.fields.metadata')}</Info>
						{cfm.length > 0 ?
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('devicetypes.fields.structure.datafield')}</TableCell>
										<TableCell>{t('devicetypes.fields.structure.value')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cfm.map((s, i) => {
										return <TableRow key={i + 'metadata'}>
											<TableCell >
												{s.key}
											</TableCell>
											<TableCell>
												{s.value}
											</TableCell>
										</TableRow>
									})}
								</TableBody>
							</Table>
						 : <Info>{t('no.deviceDataKeys')}</Info>}
					</ItemG>
				</ItemG>} />)
}

export default DeviceTypeCloudFunctions