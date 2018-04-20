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
			devices: []
			// devices: getDevicesForProject(props.item.id)
		}
	}
	componentWillUpdate = async (NextProps, NexState) => {
		if (NextProps.cardExpand === true && NextProps.cardExpand !== this.props.cardExpand) {
			var data = await getDevicesForProject(this.props.item.id)
			console.log(data)
			var regIds = []
			if (data !== null) {
				data.forEach(async element => {
					regIds.push(element.device_id)
				})
				var regs = await getDeviceRegistrations(this.props.item.id, regIds)
			}

			// console.log('regIds', regIds)
			// console.log('regs', regs)
			this.setState({ devices: data, registrations: regs })
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
							{/* 
							<UserContainer>
								<Username>{item.user.name}</Username>
								<Avatar src={item.user.img} alt="" />
							</UserContainer> */}
						</ExpHeader>
						<ExpandedProjectInfoContainer>


							<ExpSection>
								<ExpProjectInfoTitle>
									{'Enheder'} {/* ({item.devices}) */}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									{this.state.devices ?
										this.state.devices.map((d, i) => {
											return <ExpProjectInfoItem key={i}>
												{d.device_name} {' '} {d.online === '1' ? <GreenLED /> :
													<RedLED />}
											</ExpProjectInfoItem>
										})
										: <ExpProjectInfoItem> No Devices</ExpProjectInfoItem>}



									{/* <ExpProjectInfoItem>
										{item.devices[0].toString()}
									</ExpProjectInfoItem>
									<ExpProjectInfoItem>
										{item.devices[1].toString()}
									</ExpProjectInfoItem>
									<ExpProjectInfoItem>
										{item.devices[2].toString()}
									</ExpProjectInfoItem> */}
								</ExpProjectInfo>
							</ExpSection>

							<ExpSection>

								<ExpProjectInfoTitle>
									{'Seneste Registering'}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									<ExpProjectInfoItem>
										{item.seneste_reg}
									</ExpProjectInfoItem>
								</ExpProjectInfo>
							</ExpSection>


							<ExpSection>
								<ExpProjectInfoTitle>
									{'Nøgletal for projekt'}
								</ExpProjectInfoTitle>
								<ExpProjectInfo>
									<ExpProjectInfoItem>
										Total hits:	{item.hits}
									</ExpProjectInfoItem>
									<ExpProjectInfoItem>
										{item.open_date /* .toLocaleDateString() */}
									</ExpProjectInfoItem>
									{/* <ExpProjectInfoItem>
										{item.seneste_reg}
									</ExpProjectInfoItem> */}

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