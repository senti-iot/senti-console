import React, { Component } from 'react'
import { FormContainer, Header, FormInputCont, FormInput, ErrorContainer, ButtonContainer } from '../Management/ManagementStyles'
import Button from '@material-ui/core/Button/Button'
import { Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

class MyProfile extends Component {
	constructor(props) {
		super(props)

		this.state = {

		}
	}

	componentDidMount = () => {
		this.props.editDefaultForm(this.props.user)
	}
	// componentDidUpdate = () => {
	// this.props.editDefaultForm(this.props.user)
	// }
	handleEditUser = (context) => e => {
		e.preventDefault()
		this.props.handleEditUser()
		// context.refreshUserEdit()
	}
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		this.props.reset()
	};

	render() {
		const { context } = this.props

		return (
			<FormContainer>
				<Header>My Profile</Header>
				<FormInputCont>
					<FormInput
						onChange={this.props.handleEditUserInput("FirstName")}
						placeholder={context.user.vcFirstName}
						value={this.props.EditUserFields.vcFirstName}
					/>
				</FormInputCont>
				<FormInputCont>
					<FormInput
						onChange={this.props.handleEditUserInput("LastName")}
						placeholder={context.user.vcLastName}
						value={this.props.EditUserFields.vcLastName}
					/>
				</FormInputCont>
				<FormInputCont>
					<FormInput
						onChange={this.props.handleEditUserInput("Email")}
						placeholder={context.user.vcEmail}
						value={this.props.EditUserFields.vcEmail}
					/>
				</FormInputCont>
				<FormInputCont>
					<FormInput
						onChange={this.props.handleEditUserInput("Phone")}
						placeholder={context.user.vcPhone}
						value={this.props.EditUserFields.vcPhone}
					/>
				</FormInputCont>

				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center'
					}}
					color={'primary'}
					open={this.props.success}
					autoHideDuration={6000}
					onClose={this.handleClose}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={<span id="message-id">User Updated Successfully</span>}
					action={[
						<Button key="undo" color="primary" size="small" onClick={this.handleClose}>
							UNDO
						</Button>,
						<IconButton
							key="close"
							aria-label="Close"
							color="inherit"
							className={"closeicon"}
							onClick={this.handleClose}
						>
							<CloseIcon />
						</IconButton>,
					]}
				/>
				{this.props.error ? <ErrorContainer> Error! Please check your input and try again. </ErrorContainer> : null}
				<ButtonContainer style={{ marginTop: '30px' }}>
					<Button
						variant="contained"
						color={"primary"}
						onClick={this.handleEditUser(context)} >
						Update
					</Button>
				</ButtonContainer>
			</FormContainer>
		)
	}
}

export default MyProfile