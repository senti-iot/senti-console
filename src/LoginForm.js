import React, { Component } from 'react'
import ExpandedCard from './content/Aux/Modal/ExpandedCard'
import { withTheme } from 'styled-components'
import { Button, Icon } from 'odeum-ui'
import Checkbox from './content/Aux/CheckBox/CheckBox'
import { SentiLogo, LoginInputContainer, LoginFormContainer, OrgInput, UserInput, PassInput, FormInput, LoginContainer, CheckBoxText, CheckboxContainer, ErrorModalContainer, ErrorHeader, ErrorText } from './LoginStyles'
class LoginForm extends Component {

	constructor(props) {
		super(props)
		this.iconStyle = { color: 'white', height: "100%", background: this.props.theme.tab.selected, padding: 3 }
		this.state = {
			username: '',
			password: '',
			organisation: this.props.orgName,
			userInput: false,
			passInput: false,
			orgInput: false,
			orgStore: false
		}
	}
	componentDidMount = () => {
		document.addEventListener("keypress", this.handleKeyPress, false)
		this.node.focus()
		this.setState({ userInput: true })
	}
	componentWillUnmount = () => {
		document.removeEventListener("keypress", this.handleKeyPress, false)
	}
	createInputRef = (node) => {
		this.node = node
	}
	handleKeyPress = e => {
		switch (e.key) {
			case 'Enter':
				if (!this.props.error && !this.state.createUserModal)
					this.handleLogin()
				else
					this.props.reset()
				break
			case 'Escape':
				this.setState({ username: '', password: '' })
				// this.props.handleSearch('')
				break
			default:
				break
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
	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: e.target.value })
	}
	handleCreateUserInput = (input) => e => {
		e.preventDefault()
		this.setState({
			createUserFields: {
				...this.state.createUserFields,
				[input]: e.target.value
			}
		})
	}
	handleLogin = () => {
		this.props.login(this.state.username, this.state.password, this.state.orgStore, this.state.organisation)
	}
	handleCreateUser = () => {
		this.setState({ createUserModal: true })
	}
	handleCheckBox = (orgStore) => {
		// e.preventDefault()
		this.setState({ orgStore: orgStore })
	}
	render() {
		var logo = ''
		if (this.props.theme) { logo = this.props.theme.logo.default }
		const { orgInput, userInput, passInput, organisation, orgStore, username, password } = this.state
		return (
			<LoginContainer>
				<ExpandedCard cardExpand={true} horizontalControls={false} verticalControls={false} width={'50%'}>
					<SentiLogo src={logo} alt={'logo'} width={300} />
					<LoginFormContainer>
						<LoginInputContainer>
							<OrgInput active={orgInput} onClick={this.inputOnFocus("orgInput")} >
								<Icon icon={'group_add'} iconSize={25} style={this.iconStyle} />
								<FormInput
									placeholder={'Organisation'}
									onBlur={this.inputOnBlur("orgInput")}
									onChange={this.handleInput("organisation")}
									value={organisation} />
							</OrgInput>
							<UserInput active={userInput} onClick={this.inputOnFocus("userInput")}>
								<Icon icon={'person'} iconSize={25} style={this.iconStyle} />
								<FormInput
									placeholder={'Username'}
									innerRef={this.createInputRef}
									onBlur={this.inputOnBlur("userInput")}
									onChange={this.handleInput("username")}
									value={username} />
							</UserInput>
							<PassInput active={passInput} onClick={this.inputOnFocus("passInput")}>
								<Icon icon={'lock_outline'} iconSize={25} style={this.iconStyle} />
								<FormInput
									placeholder={'Password'}
									onBlur={this.inputOnBlur("passInput")}
									onChange={this.handleInput("password")}
									value={password}
									type={'password'} />
							</PassInput>

							<CheckboxContainer>
								<Checkbox size={'medium'} onChange={this.handleCheckBox} isChecked={orgStore} />
								<CheckBoxText>Save Organisation</CheckBoxText>
							</CheckboxContainer>
							<Button icon={'lock_open'} iconColor={'#ffffff'} color={this.props.theme.button.background} label={'Login'} onClick={this.handleLogin} />

						</LoginInputContainer>
					</LoginFormContainer>
					<ExpandedCard width={'20%'} height={'20%'}
						cardExpand={this.props.error}
						horizontalControls={false}
						verticalControls={false}
						handleVerticalExpand={this.props.reset}
					>
						<ErrorModalContainer>
							<ErrorHeader >Error!</ErrorHeader>
							<ErrorText>Username or password wrong or <br />there is a problem with the server.</ErrorText>
							<ErrorText> Please try again!</ErrorText>
							<Button label={'Luk'} color={'crimson'} onClick={this.props.reset} />
						</ErrorModalContainer>
					</ExpandedCard>
				</ExpandedCard>
			</LoginContainer>
		)
	}
}
export default withTheme(LoginForm)