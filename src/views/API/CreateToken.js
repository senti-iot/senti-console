import React, { Fragment, useState } from 'react'
import { Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Collapse, Button, Divider } from '@material-ui/core';
import { ItemG, TextF, DSelect, Warning, Info } from 'components';
import { Close, Save, ContentCopy } from 'variables/icons';
import projectStyles from 'assets/jss/views/projects';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import { copyToClipboard } from 'variables/functions';
// import withSnackbar from 'components/Localization/S';
import { generateToken } from 'variables/dataRegistry'
import { useSelector, useDispatch } from 'react-redux'
import { getTokens } from 'redux/data';
import AssignRegistryDialog from 'components/AssignComponents/AssignRegistryDialog';
import AssignDeviceTypeDialog from 'components/AssignComponents/AssignDeviceTypeDialog';
import { useLocalization, useSnackbar } from 'hooks'

// const mapStateToProps = (state) => ({
// 	user: state.settings.user
// })

// const mapDispatchToProps = dispatch => ({
// 	getTokens: (uId) => dispatch(getTokens(uId, true))
// })

// @Andrei
const CreateToken = props => {
	const classes = projectStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const user = useSelector(state => state.settings.user)

	const [token, setToken] = useState({
		name: "",
		type: "",
		typeId: null
	})
	const [sensor, setSensor] = useState({
		name: "",
		id: ""
	})
	const [registry, setRegistry] = useState({
		name: "",
		id: ""
	})
	const [deviceType, setDeviceType] = useState({
		name: "",
		id: ""
	})
	const [generatedToken, setGeneratedToken] = useState('')
	const [openSensor, setOpenSensor] = useState(false)
	const [openRegistry, setOpenRegistry] = useState(false)
	const [openDeviceType, setOpenDeviceType] = useState(false)
	const [openConfimClose, setOpenConfirmClose] = useState(false)
	const [confirmClose, setConfirmClose] = useState('')
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		token: {
	// 			name: "",
	// 			type: "",
	// 			typeId: null
	// 		},
	// 		sensor: {
	// 			name: "",
	// 			id: ""
	// 		},
	// 		registry: {
	// 			name: "",
	// 			id: ""
	// 		},
	// 		deviceType: {
	// 			name: "",
	// 			id: ""
	// 		},
	// 		generatedToken: "",
	// 		openSensor: false,
	// 		openRegistry: false,
	// 		openDeviceType: false,
	// 		openConfimClose: false,
	// 		confirmClose: ""
	// 	}
	// }
	const handleChange = field => e => {
		setToken({ ...token, [field]: e.target.value })
		// this.setState({
		// 	token: {
		// 		...this.state.token,
		// 		[field]: e.target.value
		// 	}
		// })
	}
	const handleGenerateToken = async () => {
		let newToken = {}
		newToken = token
		newToken.userId = user.id
		let tokenn = await generateToken(newToken)
		setGeneratedToken(tokenn) // to avoid naming conflicts
		// this.setState({
		// 	generatedToken: token
		// })
	}
	const handleClose = () => {
		setToken({ name: '', type: '', typeId: null })
		setSensor({ name: '', id: '' })
		setRegistry({ name: '', id: '' })
		setDeviceType({ name: '', id: '' })
		setGeneratedToken('')
		setOpenSensor(false)
		setOpenRegistry(false)
		setOpenDeviceType(false)
		setOpenConfirmClose(false)
		setConfirmClose('')
		// this.setState({
		// 	token: {
		// 		name: "",
		// 		type: "",
		// 		typeId: null
		// 	},
		// 	sensor: {
		// 		name: "",
		// 		id: ""
		// 	},
		// 	registry: {
		// 		name: "",
		// 		id: ""
		// 	},
		// 	deviceType: {
		// 		name: "",
		// 		id: ""
		// 	},
		// 	generatedToken: "",
		// 	openSensor: false,
		// 	openRegistry: false,
		// 	openDeviceType: false,
		// 	openConfimClose: false,
		// 	confirmClose: ""

		// })

		dispatch(getTokens(user.id))
		props.handleClose()

	}
	const handleCloseConfirmDialog = () => setOpenConfirmClose(false)

	const renderType = (type) => {
		// const { t } = this.props
		// const { sensor, openSensor, registry, openRegistry, deviceType, openDeviceType } = this.state
		switch (type) {
			case 0:
				return <Fragment>
					<TextF
						id={'token-sensor'}
						label={t('tokens.fields.types.device')}
						value={sensor.name}
						onClick={handleOpenSensor}
						readonly
						fullWidth
					/>
					<AssignSensorDialog
						t={t}
						open={openSensor}
						handleClose={() => setOpenSensor(false)}
						callBack={sensor => {
							setOpenSensor(false)
							setToken({ ...token, typeId: sensor.id })
							setSensor(sensor)
							// this.setState({
							// 	openSensor: false,
							// 	token: {
							// 		...this.state.token,
							// 		typeId: sensor.id
							// 	},
							// 	sensor: sensor
							// });
						}}
					/>
				</Fragment>
			case 1:
				return <Fragment>
					<TextF
						id={'token-registry'}
						label={t('tokens.fields.types.registry')}
						value={registry.name}
						onClick={() => setOpenRegistry(true)}
						readonly
						fullWidth
					/>
					<AssignRegistryDialog
						t={t}
						open={openRegistry}
						handleClose={() => setOpenRegistry(false)}
						callBack={registry => {
							setOpenRegistry(false)
							setToken({ ...token, typeId: registry.id })
							setRegistry(registry)
							// this.setState({
							// 	openRegistry: false,
							// 	token: {
							// 		...this.state.token,
							// 		typeId: registry.id
							// 	},
							// 	registry: registry
							// });
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
						onClick={() => setOpenDeviceType(true)}
						readonly
						fullWidth
					/>
					<AssignDeviceTypeDialog
						t={t}
						open={openDeviceType}
						handleClose={() => setOpenDeviceType(false)}
						callBack={deviceType => {
							setOpenDeviceType(false)
							setToken({ ...token, typeId: deviceType.id })
							setDeviceType(deviceType)
							// this.setState({
							// 	openDeviceType: false,
							// 	token: {
							// 		...this.state.token,
							// 		typeId: deviceType.id
							// 	},
							// 	deviceType: deviceType
							// });
						}}
					/>
				</Fragment>

			default:
				break;
		}
	}
	const handleConfirmClose = () => setOpenConfirmClose(true)

	const handleOpenSensor = () => setOpenSensor(true)

	const renderCloseDialog = () => {
		// const { classes } = props
		// const { confirmClose, generatedToken, openConfimClose } = this.state
		return <Dialog
			open={openConfimClose}
			disableBackdropClick
		>
			<DialogTitle >
				<ItemG container justify={'space-between'} alignItems={'center'}>
					{t('dialogs.tokens.createToken.title')}
					<IconButton aria-label="Close" className={classes.closeButton} onClick={handleCloseConfirmDialog}>
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
											s('snackbars.copied')
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
							onChange={e => setConfirmClose(e.target.value)}
						/>
					</ItemG>
				</ItemG>
			</DialogContent>
			<DialogActions>
				<ItemG container justify={'center'}>
					<Button
						disabled={!(confirmClose === generatedToken)}
						onClick={handleClose}
						variant={'outlined'} className={classes.redButton}>
						<Close /> {t('actions.close')}
					</Button>
				</ItemG>
			</DialogActions>
		</Dialog>
	}

	// let { openToken } = this.props
	// let { token, generatedToken } = this.state
	let { openToken } = props
	return <Dialog
		open={openToken}
		disableBackdropClick
		// onClose={this.handleCloseToken}
		aria-labelledby='alert-dialog-title'
		aria-describedby='alert-dialog-description'
	>
		{token ?
			<Fragment>
				{renderCloseDialog()}
				<DialogTitle>
					<ItemG container justify={'space-between'} alignItems={'center'}>
						{t('menus.create.token')}
						<IconButton aria-label="Close" className={classes.closeButton} onClick={generatedToken ? handleConfirmClose : props.handleClose}>
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
								onChange={handleChange('name')}
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
								onChange={handleChange('type')}
							/>
						</ItemG>
						<ItemG xs={12}>
							<Collapse in={token.type > -1}>
								{renderType(token.type)}
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
													s('snackbars.copied')
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
							onClick={generatedToken ? handleConfirmClose : handleGenerateToken}
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

export default CreateToken
