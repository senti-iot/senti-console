import React, { Component } from 'react'
import Modal from '../../../../Aux/Modal/Modal'

import {
	ProjectBarContainer, ProjectBarLabel,
	ProjectBar
} from './CardItemStyles'
import {
	ExpandedProjectInfoContainer,
	ExpSection, ExpHeader, ExpFormImg, ExpTitle, ExpAddress, ExpProjectInfoTitle, ExpProjectInfo, ExpProjectInfoItem, GreenLED, RedLED
} from '../../../../Aux/Modal/ModalStyles'
import { getProject } from '../../../../../utils/data'


export default class ExpandedCardInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			project: null
		}
	}
	componentWillUpdate = async (NextProps, NexState) => {
		//cwu because it is already mounted but invisible and empty
		if (NextProps.expand === true && NextProps.expand !== this.props.expand) {
			await getProject(this.props.item.id).then(data => {
				this.setState({ project: data })
			})
		}
	}

	preventPropagation = () => e => {
		e.stopPropagation()
	}
	render() {
		// const { item } = this.props
		// if (this.state.project) {
		const { project } = this.state

		return (
			<Modal {...this.props} handleOverlay={this.props.handleOverlay}>
				{this.state.project ? <React.Fragment>
					<ExpFormImg img={project.img ? project.img : 'https://picsum.photos/1920/1404/?random=0'} />
					<ExpHeader>
						<ExpTitle title={project.title}>{project.title}
							<ExpAddress>{project.address}</ExpAddress>
						</ExpTitle>
					</ExpHeader>
					<ExpandedProjectInfoContainer>
						<ExpSection>
							<ExpProjectInfoTitle>
								{'Enheder'}
							</ExpProjectInfoTitle>
							<ExpProjectInfo>
								{project.devices ?
									project.devices.map((d, i) => {
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
								{project.registrations ?
									project.registrations.map((r, i) => <React.Fragment>
										<ExpProjectInfoItem style={{ justifyContent: 'center' }}>
											<p style={{ fontWeight: 700 }}>{project.devices.find(e => e.device_id === r.device_id) ?
												project.devices.find(e => e.device_id === r.device_id).device_name : ' '}</p>
											{' - ' + r.registered}
										</ExpProjectInfoItem>
										{/* <ExpProjectInfoItem></ExpProjectInfoItem> */}
										{/* <ExpandedCardListItem>
											{r.count}
										</ExpandedCardListItem> */}
									</React.Fragment>
									)
									: null}
							</ExpProjectInfo>
						</ExpSection>


						<ExpSection>
							<ExpProjectInfoTitle>
								{'Nøgletal for projekt'}
							</ExpProjectInfoTitle>
							<ExpProjectInfo>
								<ExpProjectInfoItem>
									<div style={{ fontWeight: 700 }}>Total hits:</div>	{project.totalCount}
								</ExpProjectInfoItem>
								<ExpProjectInfoItem>
									<div style={{ fontWeight: 700 }}>Start date:</div>{project.open_date}
								</ExpProjectInfoItem>
								<ExpProjectInfoItem>
									<div style={{ fontWeight: 700 }}>End date:</div>{project.close_date}
								</ExpProjectInfoItem>
							</ExpProjectInfo>
						</ExpSection>
					</ExpandedProjectInfoContainer>
					<ProjectBarContainer>
						<ProjectBarLabel progress={project.progress}>{project.progress ? project.progress + '%' : '0%'}</ProjectBarLabel>
						<ProjectBar progress={project.progress} />
					</ProjectBarContainer>
				</React.Fragment> : null}
			</Modal>
		)
	}
}