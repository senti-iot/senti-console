import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, DSelect } from 'components'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
import { useLocalization } from 'hooks'
import createRegistryStyles from 'assets/jss/components/registries/createRegistryStyles';

const CreateRegistryForm = props => {
	//Hooks
	const t = useLocalization()
	const classes = createRegistryStyles()
	//Redux

	//State
	const [openOrg, setOpenOrg] = useState(false)

	//Const
	const { org, handleOrgChange, handleChange, registry, handleCreate, goToRegistries } = props

	//useCallbacks

	//useEffects

	//Handlers
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)

	const handleSetOrg = org => {
		handleOrgChange(org)
		handleCloseOrg()
	}


	const renderProtocol = () => {
		const { registry, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('registries.fields.protocol')}
			value={registry.protocol}
			onChange={handleChange('protocol')}
			menuItems={[
				{ value: 0, label: t('registries.fields.protocols.none') },
				{ value: 1, label: t('registries.fields.protocols.mqtt') },
				{ value: 2, label: t('registries.fields.protocols.http') },
				{ value: 3, label: `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}` }
			]}
		/>
	}
	const renderRegion = () => {
		const { registry, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('registries.fields.region')}
			value={registry.region}
			onChange={handleChange('region')}
			menuItems={[
				{ value: 'europe', label: t('registries.fields.regions.europe') },
			]}
		/>
	}
	const testUuname = () => {
		if (registry.uuname.length > 0) {
			if (registry.uuname.includes(' '))
				return true
		}
		return false
	}

	return (
		<GridContainer>
			<Paper className={classes.paper}>
				<form className={classes.form}>
					<Grid container>
						<ItemGrid xs={12}>
							<TextF
								id={'registryName'}
								label={t('collections.fields.name')}
								onChange={handleChange('name')}
								value={registry.name}
								autoFocus
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								error={testUuname()}
								id={'sensorName'}
								label={t('devices.fields.uuname')}
								onChange={handleChange('uuname')}
								value={registry.uuname}
								autoFocus
							/>

						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'registryDescription'}
								label={t('devices.fields.description')}
								onChange={handleChange('description')}
								value={registry.description}
								multiline
								rows={3}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{renderRegion()}
						</ItemGrid>
						<ItemGrid xs={12}>
							{renderProtocol()}
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								value={org.name}
								onClick={handleOpenOrg}
								readonly
							/>
							<AssignOrgDialog
								t={t}
								open={openOrg}
								handleClose={handleCloseOrg}
								callBack={handleSetOrg}
							/>
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


export default CreateRegistryForm