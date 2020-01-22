import React, { useState, useEffect } from 'react';
import { Collapse, Button, Paper, Hidden } from '@material-ui/core';
import { Danger, ItemG, /* Success, */ Muted, T, CircularLoader } from 'components';
import loginPageStyles from 'assets/jss/components/login/loginPageStyles';
import { getSettings } from 'redux/settings';
import TextF from 'components/CustomInput/TextF';
import { changeLanguage } from 'redux/localization';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';
import LoginImages from 'layouts/Login/LoginImages';
import { Link, useParams, useHistory } from 'react-router-dom'
import logo from 'logo.svg'
import { confirmUser as confirmSUser } from 'variables/dataUsers';
import { useLocalization, useDispatch, useEventListener } from 'hooks';

// const mapDispatchToProps = dispatch => ({
// 	getSettings: async () => dispatch(await getSettings()),
// 	changeLanguage: l => dispatch(changeLanguage(l, true))
// })

const ConfirmUser = (props) => {
	//Hooks
	const params = useParams()
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = loginPageStyles()
	const history = useHistory()
	//Redux

	//State
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loggingIn, setLoggingIn] = useState(false)
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState([])
	// const [score, setScore] = useState(0)
	// const [passwordReset, setPasswordReset] = useState(false)
	// const [passwordRequest, setPasswordRequest] = useState(false)
	//Const
	// const minScore = 2;
	// const minLength = 8;

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		password: '',
	// 		confirmPassword: '',
	// 		loggingIn: false,
	// 		error: false,
	// 		errorMessage: [],
	// 		score: 0,

	// 	};
	// 	this.input = React.createRef()
	// }
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			confirmUser()
		}
	}
	useEventListener('keypress', handleKeyPress);

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// 	window.removeEventListener('keypress', this.handleKeyPress, false)
	// }
	useEffect(() => {
		let lang = params.lang
		if (lang) {
			dispatch(changeLanguage(lang, true))
		}
		return () => {

		};
		//eslint-disable-next-line
	}, [])
	// componentDidMount() {
	// 	this._isMounted = 1
	// 	window.addEventListener('keypress', this.handleKeyPress, false)
	// 	let lang = this.props.match.params.lang
	// 	this.token = this.props.match.params.token
	// 	if (lang) {
	// 		this.props.changeLanguage(lang)
	// 	}
	// }

	// const createRef = (ref) => {
	// 	this.input = ref
	// 	return this.input
	// }
	const handleValidation = () => {
		let errorCode = [];
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
			setError(true)
			setErrorMessage(error.code.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))
			// this.setState({
			// 	error: true,
			// 	errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
			// })
			return false
		}
	}
	const errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t('confirmUser.validation.passwordEmpty')
			case 1:
				return t('confirmUser.validation.passwordUnder8')
			case 2:
				return t('confirmUser.validation.passwordMismatch')
			case 404:
				return t('confirmUser.validation.userDoesntExistAnymore')
			default:
				return ''
		}
	}

	const confirmUser = async () => {
		if (handleValidation()) {
			let session = await confirmSUser({ newPassword: password, passwordToken: params.token })
			if (session !== 404 && session)
				loginUser(session)
			else {
				setError(true)
				setErrorMessage([<Danger >{errorMessages(session)}</Danger>])
				// this.setState({
				// 	error: true,
				// 	errorMessage: []
				// })
			}
		}
	}
	const loginUser = async (session) => {
		setLoggingIn(true)
		setTimeout(
			async () => {

				cookie.save('SESSION', session, { path: '/' })
				if (session.isLoggedIn) {
					if (setToken()) {
						await dispatch(await getSettings())
						history.push('/dashboard')
					}
				}

				else {
					setError(true)
					setErrorMessage([<Danger >{t('confirmUser.networkError')}</Danger>])
					setLoggingIn(false)
					// this.setState({
					// 	error: true,
					// 	errorMessage: ,
					// 	loggingIn: false
					// })
				}
			}, 1000)
	}

	const handlePasswordChange = e => {
		setPassword(e.target.value)
		if (error) {
			setError(false)
			setErrorMessage([])
		}
	}
	const handleConfirmPasswordChange = e => {
		setConfirmPassword(e.target.value)
		if (error) {
			setError(false)
			setErrorMessage([])
		}
	}

	// const handleChange = prop => e => {

	// 	this.setState({
	// 		...this.state,
	// 		[prop]: e.target.value
	// 	})
	// 	if (this.state.error)
	// 		this.setState({
	// 			error: false,
	// 			errorMessage: []
	// 		})
	// }
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
								<T className={classes.loginButton + ' ' + classes.needAccount}>{t('confirmUser.welcomeMessage')}</T>
								<T className={classes.loginButton + ' ' + classes.needAccount}>{t('confirmUser.lastStep')}</T>
							</ItemG>
							<ItemG xs={12} container justify={'center'}>
								<ItemG container justify={'center'} xs={12}>
									<Collapse in={loggingIn}>
										<CircularLoader />
									</Collapse>
									<Collapse in={error}>
										{errorMessage.map(m => m)}
									</Collapse>
								</ItemG>

								<ItemG container xs={12}>

									<ItemG container xs={12}>
										<TextF
											fullWidth
											id={'password'}
											label={t('confirmUser.password')}
											value={password}
											className={classes.loginButton}
											onChange={handlePasswordChange}
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
											onChange={handleConfirmPasswordChange}
											margin='normal'
											error={error}
											type={'password'}
										/>
									</ItemG>
									{/* <Collapse in={passwordRequest}>
										<ItemG xs={12} className={classes.loginButton}>
											<Success>{t('dialogs.login.resetPassRequestMessage')}</Success>
										</ItemG>
									</Collapse> */}
								</ItemG>
								<ItemG xs={12} container justify={'center'}>
									<Button variant={'outlined'} color={'primary'} size='large' className={classes.loginButton} onClick={confirmUser}>
										{t('confirmUser.button')}
									</Button>
								</ItemG>
								<ItemG xs={12} container justify={'center'} style={{ margin: "32px 0px" }}>
									<ItemG xs={12} container justify={'space-around'}>
										<Link to={`/login`}>
											{t('actions.goToLogin')}
										</Link>
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
		</div>
	);
}


export default ConfirmUser;
