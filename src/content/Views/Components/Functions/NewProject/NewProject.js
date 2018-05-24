import React, { Component } from 'react'
import {
	ExpFormImg, ExpHeader, UserContainer, Username, Avatar,
	ExpandedProjectInfoContainer, ExpSection, ExpProjectInfoItem, GreenLED, RedLED
}
	from '../../../../Aux/Modal/ModalStyles'
import { StyledDropzone, TitleInput } from './NewProjectStyles'
import { Input } from '../../../ViewStyles'
import DatePicker from '../../../../Aux/DatePicker/DatePicker'
import { withTheme } from 'styled-components'
import { Button } from 'odeum-ui'
import { createOneProject, getAvailableDevices } from 'utils/data'
import Checkbox from '../../../../Aux/CheckBox/CheckBox'
import Modal from '../../../../Aux/Modal/Modal'
import moment from 'moment'

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
				project: {
					title: "",
					description: "",
					open_date: null,
					close_date: null,
					img: "",
				},
				devices: []
			},
			devices: [],
			dialog: false,
			success: false

		}
	}
	refresh = async () => {
		var devices = await getAvailableDevices()
		this.setState({
			img: undefined,
			titleInput: false,
			descriptionInput: false,
			startDate: false,
			endDate: false,
			form: {
				project: {
					title: "",
					description: "",
					open_date: moment(),
					close_date: moment(),
					img: "",
				},
				devices: []
			},
			devices: devices
		})
	}

	componentDidMount = async () => {
		this._mounted = 1
		var devices = await getAvailableDevices()
		if (this._mounted)
			this.setState({ devices: devices })
	}
	componentWillUnmount = () => {
		this._mounted = 0
	}
	onCheckedItem = id => e => checked => {
		if (e !== undefined) { if (e.preventDefault) { e.preventDefault() } }
		var newArr = this.state.form.devices
		if (checked)
			newArr.push(id)
		else
			newArr = newArr.filter(c => c !== id)
		this.setState({
			form: {
				...this.state.form,
				devices: newArr
			}
		})
	}
	handleClose = async () => {
		await this.refresh()
		this.props.close()
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
				project: {
					...this.state.form.project,
					open_date: startDate,
					close_date: endDate
				}
			}
		})

	}
	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({
			form: {
				...this.state.form,
				project: {
					...this.state.form.project,
					[input]: e.target.value
				}
			}
		})
	}
	createProject = async () => {
		// e.preventDefault()
		const { title, description, open_date, close_date } = this.state.form.project
		const { devices } = this.state.form
		var data = await createOneProject(
			{
				project: {
					title: title,
					description: description,
					open_date: open_date.toDate(),
					close_date: close_date.toDate(),
					user_id: -1,
					progress: 0,
					img: "",
					created: new Date()
				},
				devices: devices
			})
		this.onSuccess(data)
	}
	onSuccess = (success) => {
		if (success) {
			this.setState({ success: true, dialog: true })
		}
		else {
			this.setState({ dialog: true })
		}
		this.refresh()
	}
	onChecked = (id, isChecked) => {
		this.onCheckedItem(id, isChecked)
	}
	render() {
		const { exp } = this.props
		const { img } = this.state
		const { devices } = this.state
		const formDevices = this.state.form.devices
		const { open_date, close_date, title, description } = this.state.form.project
		return (
			<Modal
				horizontalControls={false}
				verticalControls={false}
				expand={exp}
				handleOverlay={this.handleClose} >
				<StyledDropzone img={this.state.img} onDrop={this.handleDrop} accept="image/jpeg,image/jpg,image/png" multiple={false}>
					{img ? <ExpFormImg img={img} alt={''} /> : <p style={{ color: '#9e9e9e', fontSize: 30 }}>Klik her for at uploade et billede</p>}
				</StyledDropzone>
				<ExpHeader>
					<TitleInput active={this.state.titleInput} onClick={this.inputOnFocus("titleInput")}>
						<Input
							placeholder={'Title'}
							style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }}
							onBlur={this.inputOnBlur("titleInput")}
							onChange={this.handleInput("title")}
							value={title} />
					</TitleInput>
					<TitleInput active={this.state.descriptionInput} onClick={this.inputOnFocus("descriptionInput")}>
						<Input
							placeholder={'Description'}
							style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }}
							onBlur={this.inputOnBlur("descriptionInput")}
							onChange={this.handleInput("description")}
							value={description} />
					</TitleInput>
					<DatePicker handleDateFilter={this.handleDateSet} startDate={open_date} endDate={close_date} />

					<UserContainer>
						<Username>UNAME</Username>
						<Avatar src={''} alt={'AVATAR-REDUX'}></Avatar>
					</UserContainer>
				</ExpHeader>
				<ExpandedProjectInfoContainer>
					<ExpSection style={{ flex: 3 }}>
						{devices ? devices.map((d, i) => {
							return <ExpProjectInfoItem key={i} style={{ height: 60 }}>
								<Checkbox size={'medium'} onChange={this.onCheckedItem(d.device_id)} isChecked={formDevices.indexOf(d.device_id) !== -1 ? true : false} />
								<div style={{ marginLeft: 5, marginRight: 5, display: 'flex', width: '100%' }}>
									{d.device_name} {' '}
									{d.online ? <GreenLED /> : <RedLED />}
								</div>
							</ExpProjectInfoItem>

						}) : null}
					</ExpSection>
					<ExpSection style={{ flex: 1 }}>
						Nogletal for project
					</ExpSection>
				</ExpandedProjectInfoContainer>
				<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', marginLeft: 'auto', marginRight: 30, marginBottom: 8 }}>
					<Button label={"Gem"} color={this.props.theme.button.background} onClick={this.createProject} />
				</div>

				<Modal
					horizontalControls={false}
					verticalControls={false}
					expand={this.state.dialog}
					handleOverlay={() => this.setState({ dialog: false })}
					width="200px"
					height="100px">
					<div>{this.state.success ? "Success" : "Error"}</div>
					<Button label={"OK"} color={this.state.success ? this.props.theme.button.background : 'crimson'} onClick={() => { this.setState({ dialog: false }); this.handleClose() }} />
				</Modal>
			</Modal>

		)
	}
}
export default withTheme(NewProject)