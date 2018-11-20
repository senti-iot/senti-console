import { List, ListItem, withStyles } from '@material-ui/core';
import footerStyle from 'assets/jss/material-dashboard-react/footerStyle';
import PropTypes from 'prop-types';
import React from 'react';


function Footer({ ...props }) {
	const { classes } = props;
	return (
		<footer className={classes.footer}>
			<div className={classes.container}>
				<div className={classes.left}>
					<List className={classes.list}>
						<ListItem className={classes.inlineBlock}>
							<a href='#home' className={classes.block}>
								Home
							</a>
						</ListItem>
						<ListItem className={classes.inlineBlock}>
							<a href='#company' className={classes.block}>
								Company
							</a>
						</ListItem>
						<ListItem className={classes.inlineBlock}>
							<a href='#portfolio' className={classes.block}>
								Portfolio
							</a>
						</ListItem>
						<ListItem className={classes.inlineBlock}>
							<a href='#blog' className={classes.block}>
								Blog
							</a>
						</ListItem>
					</List>
				</div>
				<p className={classes.right}>
					<span>
						&copy; {1900 + new Date().getYear()}{' '}
						Web House
					</span>
				</p>
			</div>
		</footer>
	);
}

Footer.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
