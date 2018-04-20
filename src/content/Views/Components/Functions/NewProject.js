import React, { Component } from 'react'
// import Dropzone from 'react-dropzone'
import { ExpFormImg, ExpHeader, /* ExpAddress */ UserContainer, Username, Avatar, ExpandedProjectInfoContainer, ExpSection } from '../../../Card/ExpandedCardStyles'
import { StyledDropzone, TitleInput } from './NewProjectStyles'
// import { ProjectBarContainer, ProjectBarLabel, ProjectBar } from '../../../Card/CardItemStyles'
import { Input } from '../../ViewStyles'
import DatePicker from '../DatePicker/DatePicker'
import { withTheme } from 'styled-components'
import Button from 'odeum-ui/lib/components/Button/Button'
import { createOneProject } from 'utils/data'

class NewProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			img: undefined,
			titleInput: false,
			descriptionInput: false,
			startDate: false,
			endDate: false,
			form: {
				title: "",
				description: "",
				open_date: null,
				close_date: null,
				user_id: -1,
				progress: 0,
				img: "",
				created: new Date()
			}

		}
	}

	inputOnFocus = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: true })
	}
	inputOnBlur = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: false })
	}
	handleDrop = (acceptedFiles) => {
		this.setState({ img: acceptedFiles[0].preview })
	}
	handleDateSet = (startDate, endDate) => {
		this.setState({
			form: {
				...this.state.form,
				open_date: startDate,
				close_date: endDate
			}
		})
	}
	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({
			form: {
				...this.state.form,
				[input]: e.target.value
			}
		})
	}
	createProject = () => async e => {
		await createOneProject(this.state.form)
		this.props.close(false)(e)
	}
	render() {
		const { img } = this.state
		return (
			<React.Fragment>
				<StyledDropzone img={this.state.img} onDrop={this.handleDrop} accept="image/jpeg,image/jpg,image/png" multiple={false}>
					{img ? <ExpFormImg img={img} alt={''} /> : <p style={{ color: '#9e9e9e', fontSize: 30 }}>Klik her for at uploade et billede</p>}
				</StyledDropzone>
				<ExpHeader>
					<TitleInput active={this.state.titleInput} onClick={this.inputOnFocus("titleInput")}>
						<Input placeholder={'Title'} style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} onBlur={this.inputOnBlur("titleInput")} onChange={this.handleInput("title")} />
					</TitleInput>
					<TitleInput active={this.state.descriptionInput} onClick={this.inputOnFocus("descriptionInput")}>
						<Input placeholder={'Description'} style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} onBlur={this.inputOnBlur("descriptionInput")} onChange={this.handleInput("description")} />
					</TitleInput>
					<DatePicker style={{ fontSize: 16 }} handleDateFilter={this.handleDateSet} startDate={this.state.form.open_date} endDate={this.state.form.close_date} />

					<UserContainer>
						<Username>UNAME</Username>
						<Avatar src={''} alt={'AVATAR-REDUX'}></Avatar>
					</UserContainer>
				</ExpHeader>
				<ExpandedProjectInfoContainer>
					<ExpSection style={{ flex: 3 }}>
						List with Devices active in the selected openclosed dates (GET Function for devices)
					</ExpSection>
					<ExpSection style={{ flex: 1 }}>
						Nogletal for project
					</ExpSection>
				</ExpandedProjectInfoContainer>
				{/* <ProjectBarContainer>
					<ProjectBarLabel progress={0}>
						GennemFort
						<ProjectBar progress={0} />

					</ProjectBarLabel>
				</ProjectBarContainer> */}
				<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', marginLeft: 'auto', marginRight: 30, marginBottom: 8 }}>
					<Button label={"Gem"} color={this.props.theme.button.background} onClick={this.createProject()}/>
				</div>
			</React.Fragment>


		)
	}
}
export default withTheme(NewProject)