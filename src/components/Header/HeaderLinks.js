import React from "react";
import classNames from "classnames";
import { Manager, Target, Popper } from "react-popper";
import {
	withStyles,
	IconButton,
	MenuItem,
	MenuList,
	Grow,
	Paper,
	ClickAwayListener,
	Hidden
} from "@material-ui/core";
import { Person, Notifications, Dashboard, Search } from "@material-ui/icons";

import { CustomInput, IconButton as SearchButton } from "components";

import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";

class HeaderLinks extends React.Component {
	state = {
		open: false,
		openProfile: false
	};
	handleClick = () => {
		this.setState({ open: !this.state.open });
	};

	handleClose = () => {
		this.setState({ open: false });
	};
	handleProfileOpen = () => {
		this.setState({ openProfile: !this.state.openProfile })
	}
	handleProfileClose = () => {
		this.setState({ openProfile: false })
	}
	render() {
		const { classes } = this.props;
		const { open, openProfile } = this.state;
		return (
			<div>
				<CustomInput
					formControlProps={{
						className: classes.margin + " " + classes.search
					}}
					inputProps={{
						placeholder: "Search",
						inputProps: {
							"aria-label": "Search"
						}
					}}
				/>
				<SearchButton
					color="white"
					aria-label="edit"
					customClass={classes.margin + " " + classes.searchButton}
				>
					<Search className={classes.searchIcon} />
				</SearchButton>
				<IconButton
					color="inherit"
					aria-label="Dashboard"
					className={classes.buttonLink}
				>
					<Dashboard className={classes.links} />
					<Hidden mdUp>
						<p className={classes.linkText}>Dashboard</p>
					</Hidden>
				</IconButton>
				<Manager style={{ display: "inline-block" }}>
					<Target>
						<IconButton
							color="inherit"
							aria-label="Notifications"
							aria-owns={open ? "menu-list" : null}
							aria-haspopup="true"
							onClick={this.handleClick}
							className={classes.buttonLink}
						>
							<Notifications className={classes.links} />
							<span className={classes.notifications}>5</span>
							<Hidden mdUp>
								<p onClick={this.handleClick} className={classes.linkText}>
									Notification
              			 		 </p>
							</Hidden>
						</IconButton>
					</Target>
					<Popper
						placement="bottom-start"
						eventsEnabled={open}
						className={
							classNames({ [classes.popperClose]: !open }) +
							" " +
							classes.pooperResponsive
						}
					>
						<ClickAwayListener onClickAway={this.handleClose}>
							<Grow
								in={open}
								id="menu-list"
								style={{ transformOrigin: "0 0 0" }}
							>
								<Paper className={classes.dropdown}>
									<MenuList role="menu">
										<MenuItem
											onClick={this.handleClose}
											className={classes.dropdownItem}
										>
											Mike John responded to your email
										</MenuItem>
									</MenuList>
								</Paper>
							</Grow>
						</ClickAwayListener>
					</Popper>
				</Manager>
				<Manager style={{ display: "inline-block" }}>
					<Target>
						<IconButton
							color="inherit"
							aria-label="Person"
							aria-owns={openProfile ? "person-list" : null}
							aria-haspopup="true"
							onClick={this.handleProfileOpen}
							className={classes.buttonLink}
						>
							<Person className={classes.links} />
							<Hidden mdUp>
								<p className={classes.linkText} onClick={this.handleProfileOpen}>Profile</p>
							</Hidden>
						</IconButton>
					</Target>
					<Popper
						placement="bottom-start"
						eventsEnabled={openProfile}
						className={
							classNames({ [classes.popperClose]: !openProfile }) +
							" " +
							classes.pooperResponsive
						}>
						<ClickAwayListener onClickAway={this.handleProfileClose}>
							<Grow
								in={openProfile}
								id="person-list"
								style={{ transformOrigin: "0 0 0" }}>
								<Paper className={classes.dropdown}>
									<MenuList role="menu">
										<MenuItem
											onClick={this.handleProfileClose}
											className={classes.dropdownItem}>
											Mike John responded to your email
										</MenuItem>
									</MenuList>
								</Paper>
							</Grow>
						</ClickAwayListener>
					</Popper>
				</Manager>
			</div>
		);
	}
}

export default withStyles(headerLinksStyle)(HeaderLinks);
