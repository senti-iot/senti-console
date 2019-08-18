import React, { Component, Fragment } from 'react'
import { Dialog, DialogTitle, IconButton, DialogContent, DialogActions, withStyles, Collapse, Button, Divider } from '@material-ui/core';
import { ItemG, TextF, DSelect, Warning, Info } from 'components';
import { Close, Save, ContentCopy } from 'variables/icons';
import projectStyles from 'assets/jss/views/projects';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import { copyToClipboard } from 'variables/functions';
import withSnackbar from 'components/Localization/S';
import { generateToken } from 'variables/dataRegistry'
import { connect } from 'react-redux'
import { getTokens } from 'redux/data';
import AssignRegistryDialog from 'components/AssignComponents/AssignRegistryDialog';
import AssignDeviceTypeDialog from 'components/AssignComponents/AssignDeviceTypeDialog';

class CreateToken extends Component {
	constructor(props) {
		super(props)

		this.state = {
			token: {
				name: "",
				type: "",
				typeId: null
			},
			sensor: {
				name: "",
				id: ""
			},
			registry: {
				name: "",
				id: ""
			},
			deviceType: {
				name: "",
				id: ""
			},
			generatedToken: "",
			openSensor: false,
			openRegistry: false,
			openDeviceType: false,
			openConfimClose: false,
			confirmClose: ""
		}
	}
	handleChange = field => e => {
		this.setState({
			token: {
				...this.state.token,
				[field]: e.target.value
			}
		})
	}
	handleGenerateToken = async () => {
		let newToken = {}
		newToken = this.state.token
		newToken.userId = this.props.user.id
		let token = await generateToken(newToken)
		this.setState({
			generatedToken: token
		})
	}
	handleClose = () => {
		this.setState({
			token: {
				name: "",
				type: "",
				typeId: null
			},
			sensor: {
				name: "",
				id: ""
			},
			registry: {
				name: "",
				id: ""
			},
			deviceType: {
				name: "",
				id: ""
			},
			generatedToken: "",
			openSensor: false,
			openRegistry: false,
			openDeviceType: false,
			openConfimClose: false,
			confirmClose: ""

		})

		this.props.getTokens(this.props.user.id)
		this.props.handleClose()

	}
	handleCloseConfirmDialog = () => this.setState({ openConfimClose: false })

	renderType = (type) => {
		const { t } = this.props
		const { sensor, openSensor, registry, openRegistry, deviceType, openDeviceType } = this.state
		switch (type) {
			case 0:
				return <Fragment>
					<TextF
						id={'token-sensor'}
						label={t('tokens.fields.types.device')}
						value={sensor.name}
						handleClick={this.handleOpenSensor}
						readonly
						fullWidth
					/>
					<AssignSensorDialog
						t={t}
						open={openSensor}
						handleClose={() => this.setState({ openSensor: false })}
						callBack={sensor => {
							this.setState({
								openSensor: false,
								token: {
									...this.state.token,
									typeId: sensor.id
								},
								sensor: sensor
							});
						}}
					/>
				</Fragment>
			case 1:
				return <Fragment>
					<TextF
						id={'token-registry'}
						label={t('tokens.fields.types.registry')}
						value={registry.name}
						handleClick={() => this.setState({ openRegistry: true })}
						readonly
						fullWidth
					/>
					<AssignRegistryDialog
						t={t}
						open={openRegistry}
						handleClose={() => this.setState({ openRegistry: false })}
						callBack={registry => {
							this.setState({
								openRegistry: false,
								token: {
									...this.state.token,
									typeId: registry.id
								},
								registry: registry
							});
						}}
					/>
				</Fragment>
			// return t('tokens.fields.types.devicetype')
			case 2:
				return <Fragment>
					<TextF
						id={'token-dt'}
						label={t('tokens.fields.types.devicetype')}
						value={deviceType.name}
						handleClick={() => this.setState({ openDeviceType: true })}
						readonly
						fullWidth
					/>
					<AssignDeviceTypeDialog
						t={t}
						open={openDeviceType}
						handleClose={() => this.setState({ openDeviceType: false })}
						callBack={deviceType => {
							this.setState({
								openDeviceType: false,
								token: {
									...this.state.token,
									typeId: deviceType.id
								},
								deviceType: deviceType
							});
						}}
					/>
				</Fragment>

			default:
				break;
		}
	}
	handleConfirmClose = () => this.setState({ openConfimClose: true })

	handleOpenSensor = () => this.setState({ openSensor: true })

	renderCloseDialog = () => {
		const { classes, t } = this.props
		const { confirmClose, generatedToken, openConfimClose } = this.state
		return <Dialog
			open={openConfimClose}
			disableBackdropClick
		>
			<DialogTitle >
				<ItemG container justify={'space-between'} alignItems={'center'}>
					{t('dialogs.tokens.createToken.title')}
					<IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleCloseConfirmDialog}>
						<Close />
					</IconButton>
				</ItemG>
			</DialogTitle>
			<DialogContent>
				<ItemG container>
					<ItemG>
						<Warning>{t('dialogs.tokens.createToken.closeWarning')}</Warning>
					</ItemG>
					<ItemG xs={12}>
						<Divider style={{ marginTop: 20 }} />
						<Info>
							{t('dialogs.tokens.createToken.closeConfirm')}
						</Info>
					</ItemG>
					<ItemG xs={12}>
						{/* <Divider /> */}
						<TextF
							id={'generatedToken'}
							fullWidth
							label={''}
							readOnly
							value={generatedToken}
							InputProps={{
								endAdornment:
									<ItemG>
										<IconButton onClick={() => {
											this.props.s('snackbars.copied')
											copyToClipboard(`${generatedToken}`)
										}
										}>
											<ContentCopy />
										</IconButton>
									</ItemG>
							}
							}
						/>
					</ItemG>
					<ItemG xs={12}>
						<TextF
							id={'token-confirmClose'}
							fullWidth
							value={confirmClose}
							handleChange={e => this.setState({ confirmClose: e.target.value })}
						/>
					</ItemG>
				</ItemG>
			</DialogContent>
			<DialogActions>
				<ItemG container justify={'center'}>
					<Button
						disabled={!(confirmClose === generatedToken)}
						onClick={this.handleClose}
						variant={'outlined'} className={classes.redButton}>
						<Close /> {t('actions.close')}
					</Button>
				</ItemG>
			</DialogActions>
		</Dialog>
	}

	render() {
		// let { openToken } = this.props
		let { token, generatedToken } = this.state
		let { t, classes, openToken } = this.props
		return <Dialog
			open={openToken}
			disableBackdropClick
			// onClose={this.handleCloseToken}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'

		>
			{token ?
				<Fragment>
					{this.renderCloseDialog()}
					<DialogTitle>
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{t('menus.create.token')}
							<IconButton aria-label="Close" className={classes.closeButton} onClick={generatedToken ? this.handleConfirmClose : this.props.handleClose}>
								<Close />
							</IconButton>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							<ItemG xs={12}>
								<TextF
									label={t('tokens.fields.name')}
									id={'tokenName'}
									value={token.name}
									fullWidth
									handleChange={this.handleChange('name')}
								/>
							</ItemG>
							<ItemG xs={12}>
								<DSelect
									fullWidth
									label={t('tokens.fields.type')}
									value={token.type}
									menuItems={[
										{ value: 0, label: t('tokens.fields.types.device') },
										{ value: 1, label: t('tokens.fields.types.registry') },
										{ value: 2, label: t('tokens.fields.types.devicetype') }
									]}
									onChange={this.handleChange('type')}
								/>
							</ItemG>
							<ItemG xs={12}>
								<Collapse in={token.type > -1}>
									{this.renderType(token.type)}
								</Collapse>
							</ItemG>
							<ItemG xs={12}>
								<Collapse in={Boolean(generatedToken)}>
									<Divider />

									<TextF
										id={'generatedToken'}
										fullWidth
										label={''}
										readOnly
										value={generatedToken}
										InputProps={{
											endAdornment:
												<ItemG>
													<IconButton onClick={() => {
														this.props.s('snackbars.copied')
														copyToClipboard(`${generatedToken}`)
													}
													}>
														<ContentCopy />
													</IconButton>
												</ItemG>
										}
										}
									/>
								</Collapse>
							</ItemG>
						</ItemG>
					</DialogContent>
					<DialogActions >
						<ItemG container justify={'center'}>
							<Button
								onClick={generatedToken ? this.handleConfirmClose : this.handleGenerateToken}
								variant={'outlined'} color={'primary'}> {
									!generatedToken ? <Fragment>
										<Save />
										{t('actions.create')}
									</Fragment> :
										<Fragment>
											<Close />
											{t('actions.close')}
										</Fragment>
								}
							</Button>
						</ItemG>
					</DialogActions>
				</Fragment>
				: null}
		</Dialog>

	}
}

const mapStateToProps = (state) => ({
	user: state.settings.user
})

const mapDispatchToProps = dispatch => ({
	getTokens: (uId) => dispatch(getTokens(uId, true))
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()(withStyles(projectStyles)(CreateToken)))
