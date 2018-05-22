import React, { Component } from 'react'
import { createOrg } from 'utils/data'
import { AppContext } from 'Login'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import {
	Container, SuccessContainer,
	ErrorContainer, FormContainer,
	Header, FormInputCont,
	CreateButtonContainer, FormInput
} from './ManagementStyles'

class CreateOrganisation extends Component {
	constructor(props) {
		super(props)
		this.defaultState = {
			error: false,
			success: false,
			createOrgFields: {
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
	handleCreateUserInput = (input) => e => {
		e.preventDefault()
		this.setState({
			createOrgFields: {
				...this.state.createOrgFields,
				["vc" + input]: e.target.value
			}
		})

	}
	handleOrgSelect = e => {
		this.setState({
			createOrgFields: {
				...this.state.createOrgFields,
				iOrgID: e.target.value
			}
		})
	}

	handleCreateUser = async () => {
		var success = await createOrg(this.state.createOrgFields)
		if (success)
			this.setState({ ...this.defaultState, success: true })

		else {
			this.setState({ error: true })
		}
	}
	render() {
		return (
			<Container>
				{this.state.success ? <SuccessContainer>
					Success !
				</SuccessContainer> : null}
				{this.state.error ? <ErrorContainer> Error! Please check your input and try again. </ErrorContainer> : null}
				<AppContext.Consumer>
					{(context) =>
						<FormContainer>
							<Header>Create a new Organisation:</Header>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Name")}
									placeholder={"Name"}
									value={this.state.createOrgFields.vcName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Address")}
									placeholder={"Address"}
									value={this.state.createOrgFields.vcAddress}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("City")}
									placeholder={"City"}
									value={this.state.createOrgFields.vcCity}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Country")}
									placeholder={"Country"}
									value={this.state.createOrgFields.vcCountry}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("URL")}
									placeholder={"Website"}
									value={this.state.createOrgFields.vcURL}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Phone")}
									placeholder={"Phone"}
									value={this.state.createOrgFields.vcPhone}
								/>
							</FormInputCont>
							<CreateButtonContainer>
								<Button
									style={{ color: 'white' }}
									icon={this.state.success ? 'close' : 'group_add'}
									iconSize={20}

									color={this.props.theme.button.background}
									label={this.state.success ? 'Close' : 'Create Organisation'}
									onClick={this.state.success ? this.props.closeModal : this.handleCreateUser}
								/>
							</CreateButtonContainer>
						</FormContainer>}
				</AppContext.Consumer>
			</Container>
		)
	}
}
export default withTheme(CreateOrganisation)