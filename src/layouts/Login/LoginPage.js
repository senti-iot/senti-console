import React from 'react';
import { InputAdornment, withStyles, CardContent, Collapse, Button, Grid, withWidth } from '@material-ui/core';
import { LockOutlined, Person, Google } from 'variables/icons';
import { GridContainer, ItemGrid, ItemG, TextF } from 'components';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardFooter from 'components/Card/CardFooter.js';
import loginPageStyle from 'assets/jss/material-dashboard-react/loginPageStyle.js';
import { loginUser } from 'variables/dataLogin';
import { setToken } from 'variables/data'
import cookie from 'react-cookies';
import classNames from 'classnames';
import CircularLoader from 'components/Loader/CircularLoader';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';
import { Link } from 'react-router-dom'
import { compose } from 'recompose';
import GoogleLogin from 'react-google-login';
import { changeLanguage } from 'redux/localization';

var moment = require('moment')

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cardAnimaton: 'cardHidden',
			user: '',
			pass: '',
			loggingIn: false,
			error: false,
			language: 'da'
		};
		this.input = React.createRef()
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.loginUser()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
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
		if (this.inputRef.current) { this.inputRef.current.focus() }
	}
	handleInput = (e) => {
		this.setState({ [e.target.id]: e.target.value })
		if (this.state.error) {
			this.setState({ error: false })
		}
	}
	createRef = (ref) => {
		this.input = ref
		return this.input
	}
	loginUser = async () => {
		this.setState({ loggingIn: true })
		setTimeout(
			async function () {
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
						this.setState({ error: true, loggingIn: false })
					}
				})
			}.bind(this),
			1000
		);


	}
	inputRef = (ref) => {
		this.input = ref
	}
	googleSignInFailed = () => {
		this.setState({ error: true })
	}
	changeLanguage = () => {
		this.props.setLanguage(this.state.language === 'en' ? 'da' : 'en')
		this.setState({
			language: this.state.language === 'en' ? 'da' : 'en'
		})
	}
	render() {
		const { classes, t } = this.props;
		const IconEndAd = classNames({
			[classes.inputIconsColor]: !this.state.error,
			[classes.iconError]: this.state.error
		})
		return (
			<div>
				<div
					className={classes.pageHeader}
					style={{
						backgroundColor: '#1a1b32',
						backgroundSize: 'cover',
						backgroundPosition: 'top center'
					}}
				>
					<div className={classes.container}>
						<GridContainer justify='center' alignItems={'center'}>
							<ItemGrid xs={12} sm={6} md={4} xl={2} lg={3}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color='primary' className={classes.cardHeader}>
											<h4>Senti.Cloud</h4>
										</CardHeader>
										<CardBody>
											<ItemG container>
												<ItemG xs={12}>
													<TextF
														id={'user'}
														autoFocus
														label={t('login.username')}
														error={this.state.error}
														fullWidth
														handleChange={this.handleInput}
														value={this.state.user}
														InputProps={{
															autoComplete: 'on',
															type: 'email',
															endAdornment: <InputAdornment position='end'>
																<Person className={IconEndAd} />
															</InputAdornment>
														}}
													/>
												</ItemG>
												<ItemG xs={12}>
													<TextF
														id={'pass'}
														label={t('login.pass')}
														error={this.state.error}
														fullWidth
														handleChange={this.handleInput}
														value={this.state.pass}
														InputProps={{
															autoComplete: 'on',
															type: 'password',
															endAdornment: <InputAdornment position='end'>
																<LockOutlined className={IconEndAd} />
															</InputAdornment>
														}}
													/>
												</ItemG>
											</ItemG>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Grid spacing={8} container justify={'center'}>
												<ItemG xs={12} container justify={'center'}>
													<Button variant="text" color={'primary'} disableFocusRipple disableRipple onClick={this.changeLanguage} className={classes.changeLanguage}>
														{t('actions.changeLanguage')}
													</Button>
												</ItemG>
												<ItemG xs={12} zeroMinWidth container justify={'center'}>
													{/* <Button variant={'text'} color={'primary'} className={classes.forgotPass}> */}
													<Link to={`/password/reset/${this.state.language}`} className={classes.forgotPass}>
														{t('actions.forgotPass')}
													</Link>
													{/* </Button> */}
												</ItemG>
												<ItemG xs={12} container justify={'center'}>
													<Button variant={'contained'} size={'large'} color={'primary'} /* className={classes.loginButton} */ onClick={this.loginUser}>
														{t('actions.login')}
													</Button>
												</ItemG>
												<ItemG xs={12} container justify={'center'}>
													<GoogleLogin
														clientId="1038408973194-qcb30o8t7opc83k158irkdiar20l3t2a.apps.googleusercontent.com"
														render={renderProps =>  (
															<Button variant={'contained'} color={'primary'} onClick={renderProps.onClick}>
																<img src={Google} alt={'google-logo'} style={{ borderRadius: 50, padding: 4, background: 'white', marginRight: 8 }}/>
																	Google {t('actions.login')}
															</Button>
														)
														}
														buttonText="Login"
														onSuccess={this.googleSignIn}
														onFailure={this.googleSignIn}
													/>
												</ItemG>
											</Grid>
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout='auto' unmountOnExit>
										<CardContent>
											{/* <Grid container><CircularProgress className={classes.loader} /></Grid> */}
											<CircularLoader notCentered />
										</CardContent>
									</Collapse>
								</Card>
							</ItemGrid>
						</GridContainer>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	defaultRoute: state.settings.defaultRoute
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	setLanguage: (lang) => dispatch(changeLanguage(lang, true)) 
})

// @ts-ignore
export default compose(connect(mapStateToProps, mapDispatchToProps), withLocalization(), withWidth(), withStyles(loginPageStyle))(LoginPage);
