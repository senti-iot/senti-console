import React, { Fragment } from 'react';
import { withStyles, Collapse, Button, Paper, Hidden } from '@material-ui/core';
import { Danger, ItemG, Success, Muted, T } from 'components';
import loginPageStyle from 'assets/jss/material-dashboard-react/loginPageStyle.js';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';
import TextF from 'components/CustomInput/TextF';
import { changeLanguage } from 'redux/localization';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';
import { resetPassword, confirmPassword } from 'variables/dataLogin';
// import FadeOutLoader from 'components/Utils/FadeOutLoader/FadeOutLoader';
import LoginImages from 'layouts/Login/LoginImages';
import { Link } from 'react-router-dom'
import logo from 'logo.svg'

class ResetPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			loggingIn: false,
			error: false,
			errorMessage: [],
			score: 0,
			minScore: 2,
			minLength: 8,
			passwordRequested: false,
			passwordReset: false
		};
		this.input = React.createRef()
	}
	handleKeyPress = (event) => {
		if (this.props.match.params.token)
			if (event.key === 'Enter') {
				this.confirmPass()
			}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}

	componentDidMount() {
		this._isMounted = 1
		window.addEventListener('keypress', this.handleKeyPress, false)
		let lang = this.props.match.params.lang
		this.token = this.props.match.params.token
		if (lang) {
			this.props.changeLanguage(lang)
		}
	}

	createRef = (ref) => {
		this.input = ref
		return this.input
	}
	handleValidation = () => {
		let errorCode = [];
		const { password, confirmPassword } = this.state
		if (password === '' && confirmPassword === '') {
			errorCode.push(0)
		}
		if (password.length < 8) {
			errorCode.push(1)
		}
		if (password !== confirmPassword) {
			errorCode.push(2)
		}
		if (errorCode.length === 0) {

			return true
		}
		else {
			this.setState({
				error: true,
				errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
			})
			return false
		}
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t('confirmUser.validation.passwordEmpty')
			case 1:
				return t('confirmUser.validation.passwordUnder8')
			case 2:
				return t('confirmUser.validation.passwordMismatch')
			case 404:
				return t('confirmUser.validation.emailDoesntExist')
			case 404.1:
				return t('confirmUser.validation.userDoesntExistAnymore')
			default:
				return ''
		}
	}
	confirmPass = async () => {
		if (this.handleValidation()) {
			const { password } = this.state
			let session = await confirmPassword({ newPassword: password, passwordToken: this.token })
			if (session !== 404 && session) {
				this.setState({
					passwordReset: true
				})
			}
			else {
				this.setState({
					error: true,
					errorMessage: [<Danger>{this.errorMessages(404.1)}</Danger>]
				})
			}
		}
	}
	resetPass = async () => {
		const { email } = this.state
		let session = await resetPassword({ email: email })
		if (session !== 404 && session) {
			this.setState({
				passwordRequested: true
			})
		}
		else {
			this.setState({
				error: true,
				errorMessage: [<Danger>{this.errorMessages(session)}</Danger>]
			})
		}
	}
	loginUser = async (session) => {
		const { t } = this.props
		this.setState({ loggingIn: true })
		setTimeout(
			async () => {

				cookie.save('SESSION', session, { path: '/' })
				if (session.isLoggedIn) {
					if (setToken()) {
						await this.props.getSettings()
						this.props.history.push('/dashboard')
					}
				}

				else {
					this.setState({
						error: true,
						errorMessage: t('confirmUser.networkError'),
						loggingIn: false
					})
				}
			}, 1000)
	}


	handleChange = prop => e => {

		this.setState({
			...this.state,
			[prop]: e.target.value
		})
		if (this.state.error)
			this.setState({
				error: false,
				errorMessage: []
			})
	}
	render() {
		const { classes, t } = this.props;
		const { error, email, errorMessage, password, confirmPassword, passwordRequested, passwordReset } = this.state
		return (
			<div className={classes.wrapper}>
				<ItemG xs={12} sm={12} md={4} lg={4} xl={3} container>
					<div className={classes.mobileContainer}>

						<Paper className={classes.paper}>
							<div className={classes.paperContainer}>

								<ItemG xs={12} container justify={'center'}>
									<img className={classes.logo} src={logo} alt={'sentiLogo'} />
								</ItemG>
								<ItemG xs={12} container justify={'center'}>
									<T className={classes.loginButton + ' ' + classes.needAccount}>
										{this.token ? t('users.fields.confirmPass') :
											t('dialogs.login.resetPasswordMessage')}
									</T>
								</ItemG>
								<ItemG xs={12} container justify={'center'}>
									<ItemG container justify={'center'} xs={12}>
										<Collapse in={passwordReset}>
											{this.token ? <Success className={classes.loginButton + ' ' + classes.needAccount}>{t('dialogs.login.passwordReseted')}</Success> : null}
										</Collapse>
										<Collapse in={!error}>

										</Collapse>
										<Collapse in={error}>
											{errorMessage}
										</Collapse>
									</ItemG>

									<ItemG container xs={12}>
										<ItemG container xs={12}>
											{!passwordRequested &&
												this.token ? null : <TextF
													id={'email'}
													autoFocus
													label={t('users.fields.email')}
													value={email}
													handleChange={this.handleChange('email')}
													margin='normal'
													fullWidth
													className={classes.loginButton}
													error={error}
												/>}
										</ItemG>

										{this.token ? <Fragment>
											<ItemG container xs={12}>
												<TextF
													fullWidth
													id={'password'}
													label={t('confirmUser.password')}
													value={password}
													className={classes.loginButton}
													handleChange={this.handleChange('password')}
													margin='normal'
													error={error}
													type={'password'}
												/>
											</ItemG>
											<ItemG container xs={12}>
												<TextF
													fullWidth
													id={'confirmpassword'}
													label={t('confirmUser.passwordConfirm')}
													value={confirmPassword}
													className={classes.loginButton}
													handleChange={this.handleChange('confirmPassword')}
													margin='normal'
													error={error}
													type={'password'}
												/>
											</ItemG>
										</Fragment> : null}
										<Collapse in={passwordRequested}>
											<ItemG xs={12} className={classes.loginButton}>
												<Success>{t('dialogs.login.resetPassRequestMessage')}</Success>
											</ItemG>
										</Collapse>
									</ItemG>
									<ItemG xs={12} container justify={'center'}>
										<Collapse in={!passwordRequested}>
											{!this.token ? <Button className={classes.loginButton} variant={'outlined'} color={'primary'} onClick={this.resetPass}>
												{t('actions.requestPasswordReset')}
											</Button> : !passwordReset ?
												<Button className={classes.loginButton} variant={'outlined'} color={'primary'} onClick={this.confirmPass}>
													{t('actions.changePassword')}
												</Button> :
												<Button className={classes.loginButton} variant={'outlined'} color={'primary'} onClick={() => this.props.history.push('/login')}>
													{t('actions.goToLogin')}
												</Button>
											}
										</Collapse>
									</ItemG>
									<ItemG xs={12} container justify={'center'} style={{ margin: "32px 0px" }}>
										<ItemG xs={12} container justify={'space-around'}>
											<Collapse in={!passwordReset}>
												<Link to={`/login`}>
													{t('actions.goToLogin')}
												</Link>
											</Collapse>
										</ItemG>
									</ItemG>
								</ItemG>
							</div>
							<ItemG xs={12} container alignItems={'flex-end'} justify={'center'} className={classes.footer}>
								<Muted className={classes.footerText}>{t('login.footer')}</Muted>
							</ItemG>
						</Paper>
					</div>
				</ItemG>
				<Hidden smDown>
					<ItemG md={8} lg={8} xl={9}>
						<LoginImages t={t} />
					</ItemG>
				</Hidden>
				{/* </ItemG> */}
			</div>
		);
	}
}
const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	changeLanguage: l => dispatch(changeLanguage(l, true))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(loginPageStyle)(ResetPassword)));
