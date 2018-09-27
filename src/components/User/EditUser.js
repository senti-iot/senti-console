import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { editUser, getUser } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { GridContainer, ItemGrid, Warning, Danger, TextF, CircularLoader } from '..';
import { Paper, Collapse, withStyles, MenuItem, Select, FormControl, InputLabel, Snackbar, Grid, Button } from '@material-ui/core';
import { Check, Save } from '@material-ui/icons'
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';

class EditUser extends Component {
	constructor(props) {
		super(props)

		this.state = {
			user: {
				userName: "",
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
				image: null,
				aux: {
					odeum: {
						language: "da"
					},
					senti: {
						
					}
				},
				sysLang: 2,
				org: {
					id: "",
					name: "Ingen organisation"
				},
				groups: {
					136550100000225: {
						id: 136550100000225,
						name: "Senti User"
					} 
				}
			},
			orgs: [],
			creating: false,
			created: false,
			loading: true,
			openSnackbar: false,
			selectedGroup: "",
		}
	}
    componentDidMount = async () => {
    	this._isMounted = 1
    	const { t, setHeader } = this.props
    	setHeader(t("users.editUser"), true, '/users', "users")
    	if (this._isMounted)
    	{
    		await this.getUser()
    		await this.getOrgs()
    	}
    }
	getUser = async () => {
		let id = this.props.match.params.id
		if (id) {
			let user = await getUser(id).then(rs => rs)
			this.setState({
				user: user
			})
		}
	}
    componentWillUnmount = () => {
    	this._isMounted = 0
    }
    getOrgs = async () => { 
    	// const { orgs } = this.state
    	let orgs = await getAllOrgs().then(rs => rs)
    	this.setState({
    		orgs: orgs,
    		loading: false
    	})
    } 
    handleEditUser = async () => {
    	const { user } = this.state
    	let newUser = {
    		...this.state.user,
    		userName: user.email
    	}
    	await editUser(newUser).then(rs => rs ?
    		this.setState({ created: true, creating: false, openSnackbar: true, org: rs }) :
    		this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t("orgs.validation.networkError") })
				
    	)
    }
    handleChange = prop => e => {
    	this.setState({
    		user: {
    			...this.state.user,
    			[prop]: e.target.value
    		}
    	})
    }
    handleValidation = () => {
    	let errorCode = [];
    	const { email } = this.state.user
    	if (email === '') {
    		errorCode.push(4)
    	}
    	this.setState({
    		errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
    	})
    	if (errorCode.length === 0)
    		return true
    	else
    		return false
    }
    errorMessages = code => {
    	const { t } = this.props
    	switch (code) {
    		case 0:
    			return t("users.validation.nouserName")
    		case 1:
    			return t("users.validation.nofirstName")
    		case 2:
    			return t("users.validation.nolastName")
    		case 3:
    			return t("users.validation.nophone")
    		case 4:
    			return t("users.validation.noemail")
    		case 5:
    			return t("users.validation.noorg")
    		case 6: 
    			return t("users.validation.nogroup")
    		default:
    			return ""
    	}
	
    }
    snackBarClose = () => {
    	this.setState({ openSnackbar: false })
    	this.redirect = setTimeout(async => {
    		this.props.history.push(`/user/${this.state.org.id}`)
    	}, 1e3)
    }
    handleLangChange = e => {
    	this.setState({
    		user: {
    			...this.state.user,
    			aux: {
    				...this.state.user.aux,
    				odeum: {
    					...this.state.user.aux.odeum,
    					language: e.target.value
    				}
    			}
    		}
    	})
    }
    handleGroupChange = e => { 
    	this.setState({
    		selectedGroup: e.target.value,
    		user: {
    			...this.state.user,
    			groups: {
    				[e.target.value]: {
    					id: e.target.value
    				}
    			}
    		}
    	})
    }
    handleOrgChange = e => {
    	this.setState({
    		user: {
    			...this.state.user,
    			org: {
    				id: e.target.value
    			}
    		}
    	})
    }
	renderOrgs = () => {
		const { classes, t, accessLevel } = this.props
		const { orgs, user, error } = this.state
		const { org } = user
		return accessLevel.apiorg.editusers ? <FormControl className={classes.formControl}>
			<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
				{t("users.fields.organisation")}
			</InputLabel>
			<Select
				error={error}
				fullWidth={false}
				color={"primary"}
				value={org.id}
				onChange={this.handleOrgChange}
			// renderValue={value => value.name}
			>
				{orgs ? orgs.map(org => (
					<MenuItem
						key={org.id}
						value={org.id}
					>
						{org.name}
					</MenuItem>
				)) : null}
			</Select>
		</FormControl> : null
	}
    renderLanguage = () => {
    	const { t, classes } = this.props
    	const { error, user } = this.state
    	let languages = [
    		{ value: "en", label: t("settings.languages.en") },
    		{ value: "da", label: t("settings.languages.da") }
    	]
    	return <FormControl className={classes.formControl}>
    		<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
    			{t("users.fields.language")}
    		</InputLabel>
    		<Select
    			error={error}
    			fullWidth={false}
    			color={"primary"}
    			value={user.aux.odeum.language}
    			onChange={this.handleLangChange}
    			// renderValue={value => languages[languages.findIndex(l => l.value === value)].label}
    		>
    			{languages.map(l => (
    				<MenuItem
    					key={l.value}
    					value={l.value}
    				>
    					{l.label}
    				</MenuItem>
    			))}
    		</Select>
    	</FormControl>
    }
    renderAccess = () => {
    	const { t, classes, accessLevel } = this.props
    	const { error, selectedGroup } = this.state
    	let groups = [
    		{
    			id: 136550100000211,
    			appId: 1220,
    			name: "Senti Account Managers",
    			show: accessLevel.apiorg.editusers ? true : false
    			// description: ""
    		},
    		{
    			id: 136550100000143,
    			appId: 1220,
    			name: "Senti Super Users",
    			// description: "Senti Cloud group containing Super Users",
    			show: accessLevel.apisuperuser ? true : false

    		},
    		{
    			id: 136550100000225,
    			appId: 1220,
    			name: "Senti Users",
    			show: true
    			// description: "Senti Users"
    		}
    	]
    	return accessLevel.apisuperuser ? <FormControl className={classes.formControl}>
    		<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
    			{t("users.fields.accessLevel")}
    		</InputLabel>
    		<Select
    			error={error}
    			fullWidth={false}
    			color={"primary"}
    			value={selectedGroup}
    			onChange={this.handleGroupChange}
    			// renderValue={value => value.name}
    		>
    			{groups.map(g => g.show ? (
    				<MenuItem
    					key={g.id}
    					value={g.id}
    				>
    					{g.name}
    				</MenuItem>
    			) : null)}
    		</Select>
    	</FormControl> : null
    }
    render() {
    	const { error, errorMessage, user, created } = this.state
    	const { classes, t } = this.props
    	const buttonClassname = classNames({
    		[classes.buttonSuccess]: created,
    	})
    	return (
    		<GridContainer justify={'center'}>
    			<Paper className={classes.paper}>
    				<form className={classes.form}>
    					<ItemGrid xs={12}>
    						<Collapse in={this.state.error}>
    							<Warning>
    								<Danger>
    									{errorMessage}
    								</Danger>
    							</Warning>
    						</Collapse>
    					</ItemGrid>
    					{/* <ItemGrid container xs={12} md={6}>
    						<TextF
    							autoFocus
    							id={"userName"}
    							label={t("users.fields.userName")}
    							value={user.userName}
    							className={classes.textField}
    							handleChange={this.handleChange("userName")}
    							margin="normal"
    							noFullWidth
    							error={error}
    						/>
    					</ItemGrid> */}
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={"firstName"}
    							label={t("users.fields.firstName")}
    							value={user.firstName}
    							className={classes.textField}
    							handleChange={this.handleChange("firstName")}
    							margin="normal"
    							noFullWidth
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={"lastName"}
    							label={t("users.fields.lastName")}
    							value={user.lastName}
    							className={classes.textField}
    							handleChange={this.handleChange("lastName")}
    							margin="normal"
    							noFullWidth
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={"email"}
    							label={t("users.fields.email")}
    							value={user.email}
    							className={classes.textField}
    							handleChange={this.handleChange("email")}
    							margin="normal"
    							noFullWidth
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={"phone"}
    							label={t("users.fields.phone")}
    							value={user.phone}
    							className={classes.textField}
    							handleChange={this.handleChange("phone")}
    							margin="normal"
    							noFullWidth
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderLanguage()}
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderOrgs()}
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderAccess()}
    					</ItemGrid>
						
    				</form>
    				<ItemGrid xs={12} container justify={'center'}>
    					<Collapse in={this.state.creating} timeout="auto" unmountOnExit>
    						<CircularLoader notCentered />
    					</Collapse>
    				</ItemGrid>
    				<Grid container justify={"center"}>
    					<div className={classes.wrapper}>
    						<Button
    							variant="contained"
    							color="primary"
    							className={buttonClassname}
    							disabled={this.state.creating || this.state.created}
    							onClick={this.handleEditUser}>
    							{this.state.created ?
    								<Fragment><Check className={classes.leftIcon} />{t("snackbars.redirect")}</Fragment>
    								: <Fragment><Save className={classes.leftIcon} />{t("users.editUser")}</Fragment>}
    						</Button>
    					</div>
    				</Grid>
    			</Paper>
    			<Snackbar
    				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    				open={this.state.openSnackbar}
    				onClose={this.snackBarClose}
    				ContentProps={{
    					'aria-describedby': 'message-id',
    				}}
    				autoHideDuration={1000}
    				message={
    					<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
    						<Check className={classes.leftIcon} color={'primary'} />
    						{t("snackbars.userUpdated", { user: user.firstName + " " + user.lastName })}
    					</ItemGrid>
    				}
    			/>
    		</GridContainer>
    	)
    }
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditUser))
