import React, { Component, Fragment } from 'react'
import { Paper, Grid, Dialog, Slide, AppBar, Toolbar, List, ListItem, Divider, ListItemText, withStyles, Button, Typography } from '@material-ui/core'
import { GridContainer, TextF, ItemGrid } from 'components/index';
import PropTypes from 'prop-types'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import cx from "classnames";
import DSelect from 'components/CustomInput/DSelect';
import { Close } from 'variables/icons';


/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateCollectionForm extends Component {

	transition = (props) => {
		return <Slide direction="up" {...props} />;
	}
	renderSelectDevice = () => {
		const { t, open, handleCloseDevice, devices, handleChangeDevice, classes } = this.props
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={open}
			onClose={handleCloseDevice}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + " " + appBarClasses}>
				<Toolbar>
					<Typography variant="h6" color="inherit" className={classes.flex}>
						{t("devices.pageTitle")}
					</Typography>
					<Button variant={'extendedFab'} color="primary" onClick={handleCloseDevice} aria-label="Close">
						<Close /> {t("actions.cancel")}
					</Button>
				</Toolbar>
			</AppBar>
			<List>
				{devices ? devices.map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeDevice(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	renderSelectState = () => {
		const { t, collection, handleChange } = this.props
		return <DSelect
			label={t("collections.fields.status")}
			value={collection.state}
			onChange={handleChange("state")}
			menuItems={[
				// { value: 0, label: t("collections.fields.status.deleted") },
				{ value: 1, label: t("collections.fields.state.active") },
				{ value: 2, label: t("collections.fields.state.inactive") }
			]}
		/>
	}
	// renderSelectOrg = () => {
	// 	const { t, open, handleCloseOrg, orgs, handleChangeOrg, classes } = this.props
	// 	const appBarClasses = cx({
	// 		[" " + classes['primary']]: 'primary'
	// 	});
	// 	return <Dialog
	// 		fullScreen
	// 		open={open}
	// 		onClose={handleCloseOrg}
	// 		TransitionComponent={this.transition}>
	// 		<AppBar className={classes.appBar + " " + appBarClasses}>
	// 			<Toolbar>
	// 				<Typography variant="h6" color="inherit" className={classes.flex}>
	// 					{t("orgs.pageTitle")}
	// 				</Typography>
	// 				<Button variant={'extendedFab'} color="primary" onClick={handleCloseOrg} aria-label="Close">
	// 					<Close /> {t("actions.cancel")}
	// 				</Button>
	// 			</Toolbar>
	// 		</AppBar>
	// 		<List>
	// 			{orgs ? orgs.map((o, i) => {
	// 				return <Fragment key={i}>
	// 					<ListItem button onClick={handleChangeOrg(o)}>
	// 						<ListItemText primary={o.name} />
	// 					</ListItem>
	// 					<Divider />
	// 				</Fragment>
	// 			}) : null}
	// 		</List>
	// 	</Dialog>
	// }
	render() {
		const { t, handleChange, collection, classes, handleOpenDevice, handleCreate, device } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'collectionName'}
									label={t("collections.fields.name")}
									handleChange={handleChange("name")}
									value={collection.name}
									autoFocus
									
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={"collectionDescription"}
									label={t("collections.fields.description")}
									handleChange={handleChange("description")}
									value={collection.description}
									multiline
									rows={3}
									
								/>
							</ItemGrid>
							{/* <ItemGrid xs={12}>
								{this.renderSelectOrg()}
								<TextF
									id={'collectionOrg'}
									label={t("collections.fields.org")}
									value={collection.org.name ? collection.org.name : t("collections.noOrg")}
									handleClick={handleOpenOrg}
									handleChange={() => { }}
									
									InputProps={{
										func: handleOpenOrg,
										readOnly: true
									}}
								/>
							</ItemGrid> */}
							<ItemGrid xs={12}>
								{this.renderSelectDevice()}
								<TextF
									id={'collectionOrg'}
									label={t("collections.fields.activeDevice")}
									value={device.name}
									handleClick={handleOpenDevice}
									handleChange={() => { }}
									
									InputProps={{
										onChange: handleOpenDevice,
										readOnly: true
									}}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderSelectState()}
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								<Button onClick={handleCreate} variant={'contained'} color={'primary'}>
									{t("actions.save")}
								</Button>
							</ItemGrid> 
						</Grid>
					</form>
				</Paper>
			</GridContainer>
		)
	}
}

CreateCollectionForm.propTypes = {
	t: PropTypes.func.isRequired,
	collection: PropTypes.object.isRequired,
	handleChangeDevice: PropTypes.func.isRequired,
	handleCloseDevice: PropTypes.func.isRequired,
	handleOpenDevice: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	devices: PropTypes.array.isRequired,
	device: PropTypes.object.isRequired,
	handleCreate: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,


}
export default withStyles(createprojectStyles)(CreateCollectionForm)