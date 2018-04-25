import React, { Component } from 'react'
import ExpandedCard from './ExpandedCard'

import {
	ProjectBarContainer, ProjectBarLabel,
	ProjectBar
} from './CardItemStyles'
import {
	ExpandedProjectInfoContainer,
	ExpSection, ExpHeader, ExpFormImg, ExpTitle, ExpAddress, /* UserContainer, Username, Avatar, */ ExpProjectInfoTitle, ExpProjectInfo, ExpProjectInfoItem, GreenLED, RedLED
} from './ExpandedCardStyles'
import { getDevicesForProject, getDeviceRegistrations } from 'utils/data'


export default class ExpandedCardInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			devices: [],
			regs: []
			// devices: getDevicesForProject(props.item.id)
		}
	}
	componentWillUpdate = async (NextProps, NexState) => {
		if (NextProps.cardExpand === true && NextProps.cardExpand !== this.props.cardExpand) {
			var data = await getDevicesForProject(this.props.item.id)
			var regIds = []
			var regs = []
			if (data !== null) {
				data.forEach(async element => {
					regIds.push(element.device_id)
				})
				regs = await getDeviceRegistrations(regIds, this.props.item.id)
				var hits = 0
				regs.forEach(element => {
					hits = hits + element.hits
				})
				this.setState({ devices: data, regs: regs, totalhits: hits })
			}

			// console.log('regIds', regIds)
		}
	}

	preventPropagation = () => e => {
		e.stopPropagation()
	}
	render() {
		const { item } = this.props
		return (
			<ExpandedCard {...this.props} handleVerticalExpand={this.props.handleVerticalExpand}>
				{this.props.cardExpand ?
					<React.Fragment>
						<ExpFormImg img={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} />
						<ExpHeader>
							<ExpTitle title={item.title}>{item.title}
								<ExpAddress>{item.address}</ExpAddress>
							</ExpTitle>

						</ExpHeader>
						<ExpandedProjectInfoContainer>


							<ExpSection>
								<ExpProjectInfoTitle>
									{'Enheder'}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									{this.state.devices ?
										this.state.devices.map((d, i) => {
											return <ExpProjectInfoItem key={i}>
												{d.device_name} {' '} {d.online ? <GreenLED /> :
													<RedLED />}
											</ExpProjectInfoItem>
										})
										: <ExpProjectInfoItem> No Devices</ExpProjectInfoItem>}
								</ExpProjectInfo>
							</ExpSection>

							<ExpSection>

								<ExpProjectInfoTitle>
									{'Seneste Registering'}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									{this.state.regs ?
										this.state.regs.map(r => <ExpProjectInfoItem key={r.reg_id}>
											<div>{r.reg_date}</div>
											<div>&nbsp;-&nbsp;</div>
											<div style={{ fontWeight: 700 }}>{this.state.devices.find(e => e.device_id === r.device_id) ? this.state.devices.find(e => e.device_id === r.device_id).device_name : ' '}</div>
										</ExpProjectInfoItem>)
										: null}
								</ExpProjectInfo>
							</ExpSection>


							<ExpSection>
								<ExpProjectInfoTitle>
									{'Nøgletal for projekt'}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									<ExpProjectInfoItem>
										<div style={{ fontWeight: 700 }}>Total hits:</div>	{this.state.totalhits}
									</ExpProjectInfoItem>
									<ExpProjectInfoItem>
										<div style={{ fontWeight: 700 }}>Start date:</div>{item.open_date}
									</ExpProjectInfoItem>
									<ExpProjectInfoItem>
										<div style={{ fontWeight: 700 }}>End date:</div>{item.close_date}
									</ExpProjectInfoItem>
								</ExpProjectInfo>
							</ExpSection>
						</ExpandedProjectInfoContainer>
						<ProjectBarContainer>
							<ProjectBarLabel progress={item.progress}>{item.progress ? item.progress + '%' : '0%'}</ProjectBarLabel>
							<ProjectBar progress={item.progress} />
						</ProjectBarContainer>
					</React.Fragment> : null}
			</ExpandedCard>
		)
	}
}