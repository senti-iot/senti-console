import React from "react";
// material-ui components
import { InputAdornment, withStyles, CardContent, Collapse, Button, Grid } from "@material-ui/core";
import { LockOutlined, Person } from "@material-ui/icons";
// core components
import { GridContainer, ItemGrid, ItemG, TextF } from "components";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
import { loginUser } from "variables/dataLogin";
import { setToken } from 'variables/data'
import cookie from "react-cookies";
import classNames from 'classnames';
import CircularLoader from "components/Loader/CircularLoader";
import withLocalization from "components/Localization/T";
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';
import { Link } from 'react-router-dom'
var moment = require("moment")

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden",
			user: '',
			pass: '',
			loggingIn: false,
			error: false
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
		if (this.inputRef.current) { this.inputRef.current.focus() }
		setTimeout(
			function () {
				return this._isMounted ? this.setState({ cardAnimaton: "" }) : '';
			}.bind(this),
			300
		);
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
						let exp = moment().add("1", "day")
						cookie.save('SESSION', rs, { path: '/', expires: exp.toDate() })
						if (rs.isLoggedIn) {
							if (setToken())								
							{
								await this.props.getSettings()
								var prevURL = this.props.location.state ? this.props.location.state.prevURL : null
								this.props.history.push(prevURL ? prevURL : "/dashboard")
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
						backgroundColor: "#1a1b32",
						backgroundSize: "cover",
						backgroundPosition: "top center"
					}}
				>
					<div className={classes.container}>
						<GridContainer justify="center">
							<ItemGrid xs={12} sm={12} md={4}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color="primary" className={classes.cardHeader}>
											<h4>Senti.Cloud</h4>
										</CardHeader>
										<CardBody>
											<ItemG container>
												<ItemG xs={12}>
													<TextF 
														id={"user"}
														autoFocus
														label={t("login.username")}
														error={this.state.error}
														fullWidth
														handleChange={this.handleInput}
														value={this.state.user}
														InputProps={{
															autoComplete: true,
															type: "email",
															endAdornment: <InputAdornment position="end">
																<Person className={IconEndAd} />
															</InputAdornment>
														}}
													/>
												</ItemG>
												<ItemG xs={12}>
													<TextF
														id={"pass"}
														label={t("login.pass")}
														error={this.state.error}
														fullWidth
														handleChange={this.handleInput}
														value={this.state.pass}
														InputProps={{
															autoComplete: true,
															type: "password",
															endAdornment: <InputAdornment position="end">
																<LockOutlined className={IconEndAd} />
															</InputAdornment>
														}}
													/>
												</ItemG>
											</ItemG>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Grid container justify={"center"}>
												<ItemG xs={12} zeroMinWidth container justify={"center"}>
													{/* <Button variant={'text'} color={'primary'} className={classes.forgotPass}> */}
													<Link to={`/password/reset/da`} className={classes.forgotPass}>
														{t("login.forgotPass")}
													</Link>
													{/* </Button> */}
												</ItemG>
												<ItemG xs={12} zeroMinWidth container justify={"center"}>
													<Button variant={'contained'} color={'primary'} /* className={classes.loginButton} */ onClick={this.loginUser}>
														{t("login.button")}
													</Button>
												</ItemG>
											</Grid>
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>
										<CardContent>
											{/* <Grid container><CircularProgress className={classes.loader} /></Grid> */}
											<CircularLoader notCentered/>
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
	
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(loginPageStyle)(LoginPage)));
