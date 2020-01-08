import React, { Component, Fragment } from 'react'
import { Paper, Grid, Dialog, AppBar, Toolbar, List, ListItem, Divider, ListItemText, withStyles, Button, Typography } from '@material-ui/core'
import { GridContainer, TextF, ItemGrid, SlideT } from 'components/index';
import PropTypes from 'prop-types'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import cx from 'classnames';
import DSelect from 'components/CustomInput/DSelect';
import { Close } from 'variables/icons';

/**
* @augments {Component<{t:object.isRequired,
	collection:object.isRequired,
	handleChange:Function.isRequired,
	handleCloseOrg:Function.isRequired,
	handleOpenOrg:Function.isRequired,
	open:boolean.isRequired,
	orgs:array.isRequired,	>}
*/
class EditCollectionForm extends Component {

	renderSelectState = () => {
		const { t, collection, handleChange } = this.props
		return <DSelect
			label={t('collections.fields.status')}
			value={collection.state}
			onChange={handleChange('state')}
			menuItems={[
				{ value: 1, label: t('collections.fields.state.active') },
				{ value: 2, label: t('collections.fields.state.inactive') }
			]}
		/>
	}
	renderSelectOrg = () => {
		const { t, open, handleCloseOrg, orgs, handleChangeOrg, classes } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={open}
			onClose={handleCloseOrg}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Typography variant='h6' color='inherit' className={classes.flex}>
						{t('orgs.pageTitle')}
					</Typography>
					<Button variant={'extendedFab'} color='primary' onClick={handleCloseOrg} aria-label='Close'>
						<Close /> {t('actions.cancel')}
					</Button>
				</Toolbar>
			</AppBar>
			<List>
				{orgs ? orgs.map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeOrg(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	render() {
		const { t, handleChange, collection, classes, handleOpenOrg, handleUpdate, goToCollection } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'collectionName'}
									label={t('collections.fields.name')}
									onChange={handleChange('name')}
									value={collection.name}
									autoFocus

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'collectionDescription'}
									label={t('collections.fields.description')}
									onChange={handleChange('description')}
									value={collection.description}
									multiline
									rows={3}

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderSelectOrg()}
								<TextF
									id={'collectionOrg'}
									label={t('collections.fields.org')}
									value={collection.org.name ? collection.org.name : t('collections.noOrg')}
									onClick={handleOpenOrg}
									onChange={() => { }}

									InputProps={{
										onChange: handleOpenOrg,
										readOnly: true
									}}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderSelectState()}
							</ItemGrid>
							<ItemGrid xs={12} container>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										// color={'danger'}
										onClick={goToCollection}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button onClick={handleUpdate} variant={'outlined'} color={'primary'}>
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
}

EditCollectionForm.propTypes = {
	t: PropTypes.func.isRequired,
	collection: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleCloseOrg: PropTypes.func.isRequired,
	handleOpenOrg: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	orgs: PropTypes.array.isRequired,
	handleUpdate: PropTypes.func.isRequired,


}
export default withStyles(createprojectStyles)(EditCollectionForm)