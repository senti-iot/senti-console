import React, { Component } from 'react'
import { InfoCard, Caption, Dropdown } from 'components';
import { Map } from 'variables/icons'
import { Grid, Checkbox } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ProjectMap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			heatMap: false
		}
	}

	renderMenu = () => {
		const { t } = this.props
		return <Dropdown menuItems={
			[
				{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
			]
		} />
	}
	render() {
		const { devices, t } = this.props
		return (
			<InfoCard
				title={t('devices.cards.map')}
				subheader={`Heatmap: ${this.state.heatMap ? 'ON' : 'OFF'}`}
				avatar={<Map />}
				topAction={this.renderMenu()}
				hiddenContent={
					<Grid container justify={'center'}>
						{devices.length > 0 ? <Maps t={t} heatMap={this.state.heatMap} isMarkerShown markers={devices} zoom={10} /> : <Caption>{t('projects.noAvailableDevices')}</Caption>}
					</Grid>
				} />

		)
	}
}
