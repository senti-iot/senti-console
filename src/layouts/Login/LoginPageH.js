import React, { useState, useEffect } from 'react'
import { ItemG } from 'components';
import { Hidden, InputAdornment } from '@material-ui/core';
import logo from 'logo.svg'
import { Person, Google, Visibility, VisibilityOff } from 'variables/icons';
import { Link, useLocation, useHistory } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import LoginImages from './LoginImages';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';
import { loginUser, loginUserViaGoogle } from 'variables/dataLogin';
import { getSettings } from 'redux/settings';
// import { changeLanguage } from 'redux/localization';
import FadeOutLoader from 'components/Utils/FadeOutLoader/FadeOutLoader';
import CookiesDialog from 'components/Cookies/CookiesDialog';
import PrivacyDialog from 'components/Cookies/PrivacyDialog';
import { LoginButton, LoginWrapper, MobileContainer, InputContainer, LeftPanel, ImgLogo, LoginLoader, NeedAccountT, LoginTF, SmallActionButton, Footer, FooterText, MutedButton } from 'styles/loginStyles';
import { useLocalization, useDispatch, useEventListener, useTheme, useSelector } from 'hooks';
import { getWL } from 'variables/storage';
let moment = require('moment');


function LoginPage(props) {

	//State
	const [error, setEError] = useState(false)
	const [user, setUser] = useState('')
	const [pass, setPass] = useState('')
	const [loggingIn, setLoggingIn] = useState(false)
	const [cookies, setCookies] = useState(false)
	const [privacy, setPrivacy] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const wl = getWL()
	const setError = val => {
		// console.trace()
		setEError(val)
	}
	//Hooks
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()
	const theme = useTheme()
	const t = useLocalization()

	//Redux
	const defaultRoute = useSelector(s => s.settings.defaultRoute)

	const handleCloseCookies = () => setCookies(false)
	const handleOpenCookies = () => setCookies(true)
	const handleOpenPrivacy = () => setPrivacy(true)
	const handleClosePrivacy = () => setPrivacy(false)


	const googleSignIn = async (googleUser) => {
		if (!googleUser || googleUser.error) {
			setError(true)
			setLoggingIn(false)
			return console.error(googleUser.error)
		}
		if (googleUser) {
			let token = googleUser.getAuthResponse().id_token
			await loginUserViaGoogle(token).then(async rs => {
				if (rs) {
					let exp = moment().add('1', 'day')
					cookie.save('SESSION', rs, { path: '/', expires: exp.toDate() })
					if (rs.isLoggedIn) {
						if (setToken()) {
							await dispatch(await getSettings())
							var prevURL = location.prevURL ? location.prevURL : null
							history.push(prevURL ? prevURL : defaultRoute)
						}
					}
				}
				else {
					setError(true)
					setLoggingIn(false)
				}
			})
		}
	}
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			logUser()
		}
	}
	useEventListener('keypress', handleKeyPress)

	const logUser = () => {
		setLoggingIn(true)
	}
	const handleLoginUser = async () => {
		console.trace()
		await loginUser(user, pass).then(async rs => {
			if (rs) {
				let exp = moment().add('1', 'day')
				cookie.save('SESSION', rs, { path: '/', expires: exp.toDate() })
				if (rs.isLoggedIn) {
					if (setToken()) {
						await dispatch(await getSettings())
						var prevURL = location.state ? location.state.prevURL : null
						setLoggingIn(false)
						history.push(prevURL ? prevURL : /* defaultRoute */ '/')
					}
				}
			}
			else {
				setError(true)
				setLoggingIn(false)
			}
		})
	}
	const handleInput = (e) => {
		switch (e.target.id) {
			case 'pass':
				setPass(e.target.value)
				break;
			case 'user':
				setUser(e.target.value)
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		// window.addEventListener('keypress', handleKeyPress, false)
		let loginData = cookie.load('SESSION')
		if (loginData) {
			if (setToken()) {
				history.push('/dashboard')
			}
		}
	});
	// useEffect(() => {
	// 	if (loggingIn) {
	// 		handleLoginUser()
	// 	}
	// 	return () => {
	// 		cleanup
	// 	};
	// }, [input])
	const handleShowPassword = () => setShowPassword(!showPassword)
	return (
		<LoginWrapper>
			{/* <ItemG container> */}
			<ItemG xs={12} sm={12} md={4} lg={4} xl={3} container>
				<MobileContainer>

					<LeftPanel>
						<InputContainer>

							{/* <ItemG container alignItems={'center'} justify={'space-evenly'} className={classes.container}> */}
							<ItemG xs={12} container justify={'center'}>
								<ImgLogo src={theme.logo ? theme.logo : logo} alt={'sentiLogo'} />
							</ItemG>
							<FadeOutLoader CustomLoader={LoginLoader} on={loggingIn} onChange={handleLoginUser} fill>
								{/* {loggingIn ? <LoginLoader /> : */}
								<ItemG xs={12} container justify={'center'}>
									<ItemG xs={12} container justify={'center'}>
										<NeedAccountT>
											<span style={{ marginRight: 4 }}>
												<span style={{ marginRight: 4 }}>
													{t('login.needAnAccount1')}
												</span>
												<span style={{ fontWeight: 600, marginRight: 4 }}>
													{wl ? wl.pageTitle ? wl.pageTitle : 'Senti' : 'Senti'}
												</span>
												<span style={{ marginRight: 4 }}>
													{t('login.needAnAccount2')}?
												</span>

											</span>
											<span>

												<Link to={'/login'}>
													{t('login.createAccount')}
												</Link>
											</span>
										</NeedAccountT>
									</ItemG>

									<ItemG container xs={12} >

										{/* <ItemG container xs={12}> */}
										<LoginTF
											id={'user'}
											autoFocus
											label={t('login.username')}
											error={error}
											fullWidth
											type={'email'}
											onChange={handleInput}
											value={user}
											InputProps={{
												endAdornment: <InputAdornment style={{ marginLeft: 8 }}>
													<Person style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
												</InputAdornment>
											}}
										/>
										{/* </ItemG> */}
										{/* <ItemG container xs={12}> */}
										<LoginTF
											id={'pass'}
											label={t('login.pass')}
											error={error}
											type={showPassword ? 'text' : 'password'}
											fullWidth
											onChange={handleInput}
											value={pass}
											InputProps={{
												endAdornment: <InputAdornment style={{ marginLeft: 8 }}>
													<SmallActionButton
														onClick={handleShowPassword}
													>
														{showPassword ? <Visibility /> : <VisibilityOff />}
													</SmallActionButton>
												</InputAdornment>
											}}
										/>
										{/* </ItemG> */}
									</ItemG>
									<ItemG xs={12} container justify={'center'}>
										<LoginButton variant={'outlined'} fullWidth color={'primary'} onClick={logUser}>
											{t('actions.login')}
										</LoginButton>
									</ItemG>
									<ItemG xs={12} container justify={'center'} style={{ margin: "8px 0px" }}>
										<ItemG xs={12} container justify={'space-around'}>
											<Link to={`/password/reset/da`}>
												{t('login.forgotPassword')}
											</Link>
										</ItemG>
									</ItemG>
									<ItemG xs={12} container justify={'center'}>
										<GoogleLogin
											clientId="1038408973194-qcb30o8t7opc83k158irkdiar20l3t2a.apps.googleusercontent.com"
											render={renderProps => (
												<LoginButton fullWidth variant={'outlined'} color={'primary'} onClick={() => { renderProps.onClick(); }}>
													<img src={Google} alt={'google-logo'} style={{ marginRight: 8 }} />
													{t('actions.loginWithGoogle')}
												</LoginButton>)}
											buttonText="Login"
											onSuccess={googleSignIn}
											onFailure={googleSignIn}
										/>
									</ItemG>
								</ItemG>
							</FadeOutLoader>
						</InputContainer>
						<Footer xs={12} container alignItems={'flex-end'} justify={'center'}>

							<FooterText>
								{`${t('login.footer')} `}
							</FooterText>

							<ItemG xs={12} container>
								<MutedButton onClick={handleOpenPrivacy}>{t('settings.t&c.privacyPolicy')}</MutedButton>
								<MutedButton onClick={handleOpenCookies}>{t('settings.t&c.cookiesPolicy')}</MutedButton>
							</ItemG>
						</Footer>
					</LeftPanel>
				</MobileContainer>
			</ItemG>
			<CookiesDialog read t={t} open={cookies} handleClose={handleCloseCookies} handleAcceptCookies={handleCloseCookies} />
			<PrivacyDialog t={t} open={privacy} handleClose={handleClosePrivacy} />
			<Hidden smDown>
				<ItemG md={8} lg={8} xl={9}>
					<LoginImages t={t} />
				</ItemG>
			</Hidden>
		</LoginWrapper>
	)
}
// }
LoginPage.whyDidYouRender = true
export default React.memo(LoginPage)
