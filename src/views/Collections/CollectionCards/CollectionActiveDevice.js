import React, { Component } from 'react'
import { InfoCard, ItemG } from '../../../components/index';

class CollectionActiveDevice extends Component {
	render() {
		const { t } = this.props
		return (
			<InfoCard
				noExpand
				title={t("collection.cards.activeDevice")}
				content={
					<ItemG container>
						
					</ItemG>
				}
			/>
		)
	}
}

export default CollectionActiveDevice
