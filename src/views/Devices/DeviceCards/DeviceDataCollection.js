import React, { useState, useEffect } from 'react'
import { getCollection } from 'variables/dataCollections';
import { InfoCard, Caption, CircularLoader, ItemGrid, ItemG, Info } from 'components';
import { DataUsage } from 'variables/icons';
import { useLocalization } from 'hooks';

// @Andrei
const DeviceDataCollection = props => {
	const t = useLocalization()
	const [loading, setLoading] = useState(true)
	const [dc, setDc] = useState(null)
	const [noDc, setNoDc] = useState(false)

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		dc: null,
	// 		noDc: false
	// 	}
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			let newDc = await getCollection(props.dcId)
			if (dc) {
				setDc(newDc)
				setLoading(false)
			} else {
				setNoDc(true)
			}
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	let dc = await getCollection(this.props.dcId)
	// 	if (dc) {
	// 		this.setState({
	// 			dc: dc,
	// 			loading: false
	// 		})
	// 	}
	// 	else {
	// 		this.setState({ noDc: true })
	// 	}
	// }

	// const { t } = this.props
	// const { dc, noDc, loading } = this.state
	return (
		<InfoCard
			noExpand
			avatar={<DataUsage />}
			title={t('collections.pageTitle')}
			subheader={noDc ? '' : <Caption>
				{`${t('collections.fields.id')}: ${dc ? dc.id : ''}`}
			</Caption>}
			content={
				!loading ? <ItemGrid container>

					<ItemG xs={12}>
						<Caption>{t(`collections.fields.name`)}</Caption>
						<Info>{dc.name}</Info>
					</ItemG>
				</ItemGrid> : noDc ? <Caption>{t('devices.noDataCollection')}</Caption> : <CircularLoader />
			}
		/>
	)
}

export default DeviceDataCollection
