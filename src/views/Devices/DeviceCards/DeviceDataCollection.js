import React, { Component } from 'react'
import { getCollection } from 'variables/dataCollections';
import { InfoCard, Caption, CircularLoader, ItemGrid, ItemG, Info } from 'components';
import { DataUsage } from 'variables/icons';

class DeviceDataCollection extends Component {

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			dc: null,
			noDc: false
		}
	}
	componentDidMount = async () => {
		let dc = await getCollection(this.props.dcId)
		if (dc) {
			this.setState({
				dc: dc, 
				loading: false
			})
		}
		else {
			this.setState({ noDc: true })
		}
	}

	render() {
		const { t } = this.props
		const { dc, noDc, loading } = this.state
		console.log(dc)
		return (
			<InfoCard
				noExpand
				avatar={<DataUsage />}
				title={t("collections.pageTitle")}
				subheader={noDc ? "" : `${t("collections.fields.id")}: ${dc ? dc.id : ""}`}
				content={
					!loading ? <ItemGrid container>
	
						<ItemG xs={12}>
							<Caption>{t(`collections.fields.name`)}</Caption>
							<Info>{dc.name}</Info>
						</ItemG>
					</ItemGrid> : noDc ? <Caption>{t("devices.noDataCollection")}</Caption> : <CircularLoader />
				}
			/>
		)
	}
}

export default DeviceDataCollection
