import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, DSelect } from 'components'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog'
import createCFStyles from 'assets/jss/components/cloudfunctions/createCFStyles'
import { useLocalization, useTheme } from 'hooks'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-monokai'


const CreateFunctionForm = props => {

	//Hooks
	const classes = createCFStyles()
	const t = useLocalization()
	const theme = useTheme()
	//Redux

	//State
	const [openOrg, setOpenOrg] = useState(false)

	//Const
	const { handleChange, org, cloudfunction, handleOrgChange, handleCreate, handleCodeChange, goToRegistries } = props

	//useCallbacks

	//useEffects

	//Handlers

	console.log('props', props)
	const renderType = () => {
		return <DSelect
			margin={'normal'}
			label={t('cloudfunctions.fields.type')}
			value={cloudfunction.type}
			onChange={handleChange('type')}
			menuItems={[
				{ value: 0, label: t('cloudfunctions.fields.types.function') },
				// { value: 1, label: t('cloudfunctions.fields.types.external') },
			]}
		/>
	}

	return (
		<GridContainer>
			<Paper className={classes.paper}>
				<form className={classes.form}>
					<Grid container>
						<ItemGrid xs={12}>
							<TextF
								id={'functionName'}
								label={t('collections.fields.name')}
								onChange={handleChange('name')}
								value={cloudfunction.name}
								autoFocus
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'functionDesc'}
								label={t('collections.fields.description')}
								onChange={handleChange('description')}
								value={cloudfunction.description}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{renderType()}
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'cfOrgId'}
								value={org.name}
								onClick={() => setOpenOrg(true)}
								readonly
							/>
							<AssignOrgDialog
								open={openOrg}
								handleClose={() => setOpenOrg(false)}
								callBack={org => { setOpenOrg(false); handleOrgChange(org) }}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{cloudfunction.type === 0 ?
								<div className={classes.editor}>
									<AceEditor
										mode={'javascript'}
										theme={theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										onChange={handleCodeChange('js')}
										value={cloudfunction.js}
										showPrintMargin={false}
										style={{ width: '100%' }}
										name="createCloudFunction"
										editorProps={{ $blockScrolling: true }}
									/>
								</div> : null
							}
						</ItemGrid>
						<ItemGrid container style={{ margin: 16 }}>
							<div className={classes.wrapper}>
								<Button
									variant='outlined'
									onClick={goToRegistries}
									className={classes.redButton}
								>
									{t('actions.cancel')}
								</Button>
							</div>
							<div className={classes.wrapper}>
								<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
									{t('actions.save')}
								</Button>
							</div>
						</ItemGrid>

					</Grid>
				</form>
			</Paper>
		</GridContainer>
	)
}


export default CreateFunctionForm