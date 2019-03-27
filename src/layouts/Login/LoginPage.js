import React, { Component } from 'react'
import { ItemG, TextF, T, Muted } from 'components';
import { Hidden, Paper, withStyles, InputAdornment, Button, withWidth, ButtonBase, IconButton } from '@material-ui/core';
import logo from 'logo.svg'
import { connect } from 'react-redux'
import { Person, Google, Visibility, VisibilityOff } from 'variables/icons';
import cx from 'classnames'
import withLocalization from 'components/Localization/T';
import { compose } from 'recompose';
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import LoginImages from './LoginImages';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';
import { loginUser, loginUserViaGoogle } from 'variables/dataLogin';
import { getSettings } from 'redux/settings';
import { changeLanguage } from 'redux/localization';
// import ResetPassword from 'layouts/ResetPassowrd/ResetPassword';
import FadeOutLoader from 'components/Utils/FadeOutLoader/FadeOutLoader';
import loginPageStyles from 'assets/jss/material-dashboard-react/loginPageStyle';
import CookiesDialog from 'components/Cookies/CookiesDialog';
import PrivacyDialog from 'components/Cookies/PrivacyDialog';
import { defaultFont } from 'assets/jss/material-dashboard-react';

let moment = require('moment');


class NewLoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			error: false,
			user: '',
			pass: '',
			language: 'da',
			loggingIn: false,
			cookies: false,
			privacy: false,
			showPassword: false
		}
		this.input = React.createRef()
	}
	handleCookies = () => {
		this.setState({
			cookies: !this.state.cookies
		})
	}
	handlePrivacy = () => {
		this.setState({
			privacy: !this.state.privacy
		})
	}
	googleSignIn = async (googleUser) => {
		if (googleUser.error) {
			this.setState({ loggingIn: false, error: true })
			return console.log(googleUser.error)
		}
		if (googleUser) {
			let token = googleUser.getAuthResponse().id_token
			await loginUserViaGoogle(token).then(async rs => {
				if (rs) {
					let exp = moment().add('1', 'day')
					cookie.save('SESSION', rs, { path: '/', expires: exp.toDate() })
					if (rs.isLoggedIn) {
						if (setToken()) {
							await this.props.getSettings()
							var prevURL = this.props.location.state ? this.props.location.state.prevURL : null
							this.props.history.push(prevURL ? prevURL : this.props.defaultRoute) //Aici
						}
					}
				}
				else {
					this.setState({ error: true })
				}
			})
		}
	}
	logUser = () => {
		this.setState({ loggingIn: true })
	}
	loginUser = async () => {
		// this.setState({ loggingIn: true })

		await loginUser(this.state.user, this.state.pass).then(async rs => {
			if (rs) {
				let exp = moment().add('1', 'day')
				cookie.save('SESSION', rs, { path: '/', expires: exp.toDate() })
				if (rs.isLoggedIn) {
					if (setToken()) {
						await this.props.getSettings()
						var prevURL = this.props.location.state ? this.props.location.state.prevURL : null
						this.props.history.push(prevURL ? prevURL : this.props.defaultRoute) //Aici
					}
				}
			}
			else {
				this.setState({ error: true })
			}
		})
		// this.setState({ loggingIn: false })
	}
	handleInput = (e) => {
		this.setState({ [e.target.id]: e.target.value })
		if (this.state.error) {
			this.setState({ error: false })
		}
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.logUser()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}
	inputRef = (ref) => {
		this.input = ref
	}
	componentDidMount() {
		this._isMounted = 1
		window.addEventListener('keypress', this.handleKeyPress, false)
		var loginData = cookie.load('SESSION')
		if (loginData) {
			if (setToken()) {
				this.props.history.push('/dashboard')
			}
		}
		if (this.props.location.pathname.includes('en')) {
			this.props.setLanguage('en')
			this.setState({ language: 'en' })
		}
		// @ts-ignore
		if (this.inputRef.current) { this.inputRef.current.focus() }
	}

	render() {
		const { classes, t } = this.props
		const { language, loggingIn, loggingInGoogle, privacy, cookies } = this.state
		const IconEndAd = cx({
			[classes.IconEndAd]: true,
			[classes.inputIconsColor]: !this.state.error,
			[classes.iconError]: this.state.error
		})
		return (
			<div className={classes.wrapper}>
				{/* <ItemG container> */}
				<ItemG xs={12} sm={12} md={4} lg={4} xl={3} container>
					<div className={classes.mobileContainer}>

						<Paper className={classes.paper}>
							<div className={classes.paperContainer} style={{ overflow: 'auto' }}>

								{/* <ItemG container alignItems={'center'} justify={'space-evenly'} className={classes.container}> */}
								<ItemG xs={12} container justify={'center'}>
									<img className={classes.logo} src={logo} alt={'sentiLogo'} />
								</ItemG>
								<FadeOutLoader circularClasses={classes.loader} on={loggingIn} onChange={this.loginUser} notCentered>
									<FadeOutLoader circularClasses={classes.loader} on={loggingInGoogle} onChange={() => {}} notCentered>

										<ItemG xs={12} container justify={'center'}>
											<ItemG xs={12} container justify={'center'}>
												<T className={classes.loginButton + ' ' + classes.needAccount}>
													<span style={{ marginRight: 4 }}>
														{t('login.needAnAccount1')}<span style={{ fontWeight: 600 }}> Senti</span> <span>{t('login.needAnAccount2')}</span>?
													</span>
													<span>
														<Link to={'/login'}>
															{t('login.createAccount')}
														</Link>
													</span>
												</T>
											</ItemG>

											<ItemG container xs={12} >

												{/* <ItemG container xs={12}> */}
												<TextF
													id={'user'}
													autoFocus
													reversed
													label={t('login.username')}
													error={this.state.error}
													fullWidth
													handleChange={this.handleInput}
													className={classes.loginButton}
													value={this.state.user}
													InputProps={{
														autoComplete: 'on',
														type: 'email',
														endAdornment: <InputAdornment classes={{ root: IconEndAd }}>
															<Person style={{ color: 'rgba(0, 0, 0, 0.54)' }}/>
														</InputAdornment>
													}}
												/>
												{/* </ItemG> */}
												{/* <ItemG container xs={12}> */}
												<TextF
													id={'pass'}
													label={t('login.pass')}
													error={this.state.error}
													className={classes.loginButton}
													type={this.state.showPassword ? 'text' : 'password'}
													fullWidth
													handleChange={this.handleInput}
													value={this.state.pass}
													InputProps={{
														autoComplete: 'on',
														// type: 'password',
														endAdornment: <InputAdornment classes={{ root: IconEndAd }}>
														                <IconButton
																className={classes.smallAction}
																onClick={() => this.setState({ showPassword: !this.state.showPassword })}
															>
																{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
															</IconButton>
														</InputAdornment>
													}}
												/>
												{/* </ItemG> */}
											</ItemG>
											<ItemG xs={12} container justify={'center'}>
												<Button variant={'outlined'} fullWidth color={'primary'} className={classes.loginButton} onClick={this.logUser}>
													{t('actions.login')}
												</Button>
											</ItemG>
											<ItemG xs={12} container justify={'center'} style={{ margin: "8px 0px" }}>
												<ItemG xs={12} container justify={'space-around'}>
													<Link to={`/password/reset/${language}`}>
														{t('login.forgotPassword')}
													</Link>
												</ItemG>
											</ItemG>
											<ItemG xs={12} container justify={'center'}>
												<GoogleLogin
													clientId="1038408973194-qcb30o8t7opc83k158irkdiar20l3t2a.apps.googleusercontent.com"
													render={renderProps => (
														<Button fullWidth className={classes.loginButton} variant={'outlined'} color={'primary'} onClick={() => {renderProps.onClick(); this.setState({ loggingInGoogle: true })}}>
															<img src={Google} alt={'google-logo'} style={{ marginRight: 8 }} />
															{t('actions.loginWithGoogle')}
														</Button>)}
													buttonText="Login"
													onSuccess={this.googleSignIn}
													onFailure={this.googleSignIn}
												/>
											</ItemG>
										</ItemG>
									</FadeOutLoader>
								</FadeOutLoader>
							</div>
							<ItemG xs={12} container alignItems={'flex-end'} justify={'center'} className={classes.footer}>
								<Muted className={classes.footerText}>
									<T paragraph style={{ ...defaultFont, fontSize: 13, color: 'inherit' }}>
										{`${t('login.footer')} `}
									</T>
									<ButtonBase onClick={this.handleCookies} style={{ ...defaultFont, fontSize: 13, margin: "0px 4px", textDecoration: 'underline' }}>{t('settings.t&c.cookiesPolicy')}</ButtonBase>
									<ButtonBase onClick={this.handlePrivacy} style={{ ...defaultFont, fontSize: 13, margin: "0px 4px", textDecoration: 'underline' }}>{t('settings.t&c.privacyPolicy')}</ButtonBase>
								</Muted>
							</ItemG>
						</Paper>
					</div>
				</ItemG>
				<CookiesDialog read t={t} open={cookies} handleClose={this.handleCookies} handleAcceptCookies={this.handleCookies} />
				<PrivacyDialog t={t} open={privacy} handleClose={this.handlePrivacy} />
				<Hidden smDown>
					<ItemG md={8} lg={8} xl={9}>
						<LoginImages t={t} />
					</ItemG>
				</Hidden>
			</div>
		)
	}
}
const mapStateToProps = (state) => ({
	defaultRoute: state.settings.defaultRoute
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	setLanguage: (lang) => dispatch(changeLanguage(lang, true))
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withLocalization(), withStyles(loginPageStyles), withWidth())(NewLoginPage)
