import React, { Component } from 'react'
import ExpandedCard from './content/Card/ExpandedCard'
import { withTheme } from 'styled-components'
import { Input } from 'content/Views/ViewStyles'
import { TitleInput } from 'content/Views/Components/Functions/NewProjectStyles'
import { Button, Icon } from 'odeum-ui'
class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			username: '',
			password: '',
			userInput: false,
			passInput: false
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
		console.log(node)
		this.node = node
	}
	handleKeyPress = e => {
		switch (e.key) {
			case 'Enter':
				this.handleLogin()
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

	handleLogin = () => {
		this.props.login(this.state.username, this.state.password)
	}

	render() {
		return (
			<div style={{ width: '100vw', height: '100vh', background: this.props.theme.header.background }}>
				<ExpandedCard cardExpand={true} horizontalControls={false} verticalControls={false} width={'50%'}>
					<img src={this.props.theme.logo.default} alt={'logo'} width={300} style={{ background: this.props.theme.header.background, borderRadius: '4px', margin: 5, padding: 10, marginBottom: 100 }} />
					<div style={{ width: '100%', display: 'flex', alignItems: 'center', flexFlow: 'column nowrap' }}>
						<div style={{ display: 'flex', height: '150px', flexFlow: 'column nowrap', margin: 5, justifyContent: 'space-between', alignItems: 'center' }}>
							<TitleInput active={this.state.userInput} onClick={this.inputOnFocus("userInput")} style={{ height: 40, margin: 4 }}>
								<Icon icon={'person'} iconSize={25} style={{ color: 'white', margin: 3, padding: 3 }} />
								<Input
									innerRef={this.createInputRef}
									placeholder={'Username'}
									style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }}
									onBlur={this.inputOnBlur("userInput")}
									onChange={this.handleInput("username")}
									value={this.state.username}
								// onKeyPress={this.handleKeyPress} 
								/>
							</TitleInput>
							<TitleInput active={this.state.passInput} onClick={this.inputOnFocus("passInput")} style={{ height: 40, margin: 4 }}>
								<Icon icon={'lock_outline'} iconSize={25} style={{ color: 'white', margin: 3, padding: 3 }} />
								<Input
									placeholder={'Password'}
									style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }}
									onBlur={this.inputOnBlur("passInput")}
									onChange={this.handleInput("password")}
									value={this.state.password}
									// onKeyPress={this.handleKeyPress}
									type={'password'} />
							</TitleInput>
							<Button icon={'lock_open'} color={this.props.theme.button.background} label={'Login'} onClick={this.handleLogin} />
						</div>
					</div>
				</ExpandedCard>
			</div>
		)
	}
}
export default withTheme(LoginForm)