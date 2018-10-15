import { Grid, withStyles } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { Caption, Info, ItemGrid, ItemG } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Business, DataUsage, Edit, DeviceHub, LibraryBooks, Close } from 'variables/icons';
// import React from 'react'



class DeviceDetails extends Component {

	collectionState = () => {
		const { collection, t } = this.props
		switch (collection.state) {
			case 1:
				return t("collections.fields.state.active")
			case 2:
				return t("collections.fields.state.inactive")
			default:
				break;
		}
	}

	render() {
		const { classes, collection, t, accessLevel, history, handleOpenDeleteDialog } = this.props
		return (
			<InfoCard
				title={collection.name ? collection.name : collection.id}
				avatar={<DataUsage />}
				topAction={<Dropdown menuItems={
					[
						{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/collection/${collection.id}/edit`, state: { prevURL: `/collection/${collection.id}` } }) },
						{ label: collection.activeDeviceStats ? t("menus.reassignDevice") : t("menus.assignDevice"), icon: <DeviceHub className={classes.leftIcon} />, func: this.props.handleOpenAssignDevice },
						{ label: collection.org.id > 0 ? t("menus.reassignOrg") : t("menus.assignOrg"), icon: <Business className={classes.leftIcon} />, func: this.props.handleOpenAssignOrg, dontShow: accessLevel.apisuperuser ? false : true },
						{ label: collection.project.id ? t("menus.reassignProject") : t("menus.assignProject"), icon: <LibraryBooks className={classes.leftIcon} />, func: this.props.handleOpenAssignProject, /*  dontShow: collection.org.id > 0 ? false : true */ },
						{ label: t("menus.delete"), icon: <Close className={classes.leftIcon} />, func: handleOpenDeleteDialog }
					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t("collections.fields.id")}:</Caption>&nbsp;{collection.id}
				</ItemG>}
				noExpand
				content={
					<Fragment>
						<Grid container>
							<ItemGrid>
								<Caption>{t("collections.fields.status")}:</Caption>
								<Info>{this.collectionState()}</Info>
							</ItemGrid>
							<ItemGrid xs={12}>
								<Caption>{t("collections.fields.description")}:</Caption>
								<Info>{collection.description ? collection.description : ""}</Info>
							</ItemGrid>

						</Grid>
						<Grid container>

						</Grid>
						<Grid container>
							<ItemGrid>
								<Caption>{t("collections.fields.org")}:</Caption>
								<Info>{collection.org ?
									<Link to={`/org/${collection.org.id}`} >
										{collection.org.name}
									</Link>
									: t("collections.noProject")}</Info>

							</ItemGrid>

						</Grid>
						<Grid container>
							<ItemGrid>
								<Caption>{t("collections.fields.project")}:</Caption>
								<Info>{collection.project ?
									<Link to={{
										pathname: `/project/${collection.project.id}`,
										state: {
											prevURL: `/collection/${collection.id}`
										}
									}} >
										{collection.project.title}
									</Link>
									: t("collections.noProject")}</Info>

							</ItemGrid>

						</Grid>
					</Fragment>} />
		)
	}
}

export default withStyles(collectionStyles)(DeviceDetails)