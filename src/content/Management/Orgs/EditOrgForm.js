import React, { Component } from 'react'
import { updateOrg } from 'utils/data'
import { AppContext } from 'Login'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import {
	Container, SuccessContainer,
	ErrorContainer, FormContainer,
	Header, FormInputCont,
	CreateButtonContainer, FormInput
} from '../ManagementStyles'

class EditOrganisation extends Component {
	constructor(props) {
		super(props)
		this.defaultState = {
			error: false,
			success: false,
			editOrgFields: {
				vcName: '',
				vcAddress: '',
				vcCity: '',
				vcCountry: '',
				vcURL: '',
				vcPhone: ''
			}
		}
		this.state = this.defaultState
	}
	editDefaultForm = (org) => {
		this.setState({
			editOrgFields: {
				iOrgID: org.iOrgID,
				vcName: org.vcName,
				vcAddress: org.vcAddress,
				vcCity: org.vcCity,
				vcCountry: org.vcCountry,
				vcURL: org.vcURL,
			}
		})
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.org) {
			if (this.props.org) {
				if (this.props.org.iOrgID !== prevProps.org.iOrgID) {
					this.editDefaultForm(this.props.org)
				}
			}
		}
		else {
			if (!prevProps.org && this.props.org) {
				this.editDefaultForm(this.props.org)
			}
		}
	}

	handleEditOrgInput = (input) => e => {
		e.preventDefault()
		this.setState({
			editOrgFields: {
				...this.state.editOrgFields,
				["vc" + input]: e.target.value
			}
		})

	}
	handleOrgSelect = e => {
		this.setState({
			editOrgFields: {
				...this.state.editOrgFields,
				iOrgID: e.target.value
			}
		})
	}

	handleUpdateOrg = async () => {
		var success = await updateOrg(this.state.editOrgFields)
		if (success)
			this.setState({ success: true })

		else {
			this.setState({ error: true })
		}
	}
	closeAndReset = () => {
		this.props.closeModal()
		this.setState({ success: false })

	}
	render() {
		return (
			<Container>

				<AppContext.Consumer>
					{(context) =>
						<FormContainer>

							<Header>Edit Organisation:</Header>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditOrgInput("Name")}
									placeholder={"Name"}
									value={this.state.editOrgFields.vcName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditOrgInput("Address")}
									placeholder={"Address"}
									value={this.state.editOrgFields.vcAddress}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditOrgInput("City")}
									placeholder={"City"}
									value={this.state.editOrgFields.vcCity}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditOrgInput("Country")}
									placeholder={"Country"}
									value={this.state.editOrgFields.vcCountry}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditOrgInput("URL")}
									placeholder={"Website"}
									value={this.state.editOrgFields.vcURL}
								/>
							</FormInputCont>
							{this.state.success ? <SuccessContainer>Success !</SuccessContainer> : null}
							{this.state.error ? <ErrorContainer> Error! Please check your input and try again. </ErrorContainer> : null}
							<CreateButtonContainer>
								<Button
									style={{ color: 'white' }}
									icon={this.state.success ? 'close' : 'group_add'}
									iconSize={20}

									color={this.props.theme.button.background}
									label={this.state.success ? 'Close' : 'Update Organisation'}
									onClick={this.state.success ? this.closeAndReset : this.handleUpdateOrg}
								/>
							</CreateButtonContainer>
						</FormContainer>}
				</AppContext.Consumer>
			</Container>
		)
	}
}
export default withTheme(EditOrganisation)