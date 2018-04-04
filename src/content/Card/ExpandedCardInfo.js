import React, { Component } from 'react'
import ExpandedCard from './ExpandedCard'

import {
	ProjectBarContainer, ProjectBarLabel,
	ProjectBar
} from './CardItemStyles'
import {
	ExpandedProjectInfoContainer,
	ExpSection, ExpHeader, ExpFormImg, ExpTitle, ExpAddress, UserContainer, Username, Avatar, ExpProjectInfoTitle, ExpProjectInfo, ExpProjectInfoItem
} from './ExpandedCardStyles'


export default class ExpandedCardInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false
		}
	}
	preventPropagation = () => e => {
		e.stopPropagation()
	}
	render() {
		const { item } = this.props
		return (
			<ExpandedCard {...this.props}>
				<ExpFormImg img={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} />
				<ExpHeader>
					<ExpTitle title={item.title}>{item.title}
						<ExpAddress>{item.address}</ExpAddress>
					</ExpTitle>

					<UserContainer>
						<Username>{item.user.name}</Username>
						<Avatar src={item.user.img} alt="" />
					</UserContainer>
				</ExpHeader>
				<ExpandedProjectInfoContainer>


					<ExpSection>
						<ExpProjectInfoTitle>
							{'Enheder'} ({item.devices.length})
						</ExpProjectInfoTitle>
						<ExpProjectInfo>
							<ExpProjectInfoItem>
								{item.devices[0].toString()}
							</ExpProjectInfoItem>
							<ExpProjectInfoItem>
								{item.devices[1].toString()}
							</ExpProjectInfoItem>
							<ExpProjectInfoItem>
								{item.devices[2].toString()}
							</ExpProjectInfoItem>
						</ExpProjectInfo>
					</ExpSection>

					<ExpSection>

						<ExpProjectInfoTitle>
							{'Seneste Registering'}
						</ExpProjectInfoTitle>
						<ExpProjectInfo>
							<ExpProjectInfoItem>
								{item.seneste_reg.toLocaleDateString()}
							</ExpProjectInfoItem>
							<ExpProjectInfoItem>
								{item.seneste_reg.toLocaleDateString()}
							</ExpProjectInfoItem>
							<ExpProjectInfoItem>
								{item.seneste_reg.toLocaleDateString()}
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
								{item.seneste_reg.toLocaleDateString()}
							</ExpProjectInfoItem>
							<ExpProjectInfoItem>
								{item.seneste_reg.toLocaleDateString()}
							</ExpProjectInfoItem>

						</ExpProjectInfo>
					</ExpSection>
				</ExpandedProjectInfoContainer>
				<ProjectBarContainer>
					<ProjectBarLabel progress={item.progress}>{item.progress ? item.progress + '%' : '0%'}</ProjectBarLabel>
					<ProjectBar progress={item.progress} />
				</ProjectBarContainer>
			</ExpandedCard>
		)
	}
}