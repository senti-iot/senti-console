

import React, { PureComponent } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';

const styles = theme => ({
	tab: {
		// [theme.breakpoints.down("xs")]: {
		// 	minWidth: 56
		// }
	},

	appBar: {
		display: 'flex',
		flexFlow: "row",
		justifyContent: 'space-between',
		maxWidth: "100%",
		overflow: "hidden",
		// top: 70,
		minHeight: 48,
		height: 48,
		zIndex: 1300
	},
	contentToolbar: { 
		// display: 'flex',
		// alignItems: "flex-start",
		// flexFlow: "row",
		// justifyContent: 'space-between',
		height: 41,
		minHeight: 41,
		maxHeight: 41,
		padding: "0 8px",
		// marginRight: 8,
		marginLeft: 'auto',
		// borderLeft: "1px solid rgb(255, 255, 255, 0.5)"
	},
	dividerContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: 41,
	},
	divider: {
		width: 2,
		height: 30,
		background: "rgb(255, 255, 255, 0.5)",
	},
	noOverflow: {
		overflow: 'hidden'
	},
})

class Toolbar extends PureComponent {
	constructor(props) {
	  super(props)
	
	  this.state = {
			route: props.defaultRoute ? props.defaultRoute : 0	 
	  }
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleScroll = el => {
		
		let topOfElement = el.offsetTop - 130
		let container = document.getElementById('container')
		container.scroll({ top: topOfElement, behavior: 'smooth' })
		
	}
	render() {
		const { classes, tabs, data, noSearch, filters, handleFilterKeyword, content, width } = this.props
		return (
			<AppBar position={'sticky'} classes={{ root: classes.appBar }}>
				{tabs ? <Tabs value={this.state.route} scrollable={width === "xs" ? true : undefined} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
					{tabs ? tabs.map((t, i) => {
						return <Tab title={t.title}
							component={(props) => <Link {...props} scroll={this.handleScroll } style={{ color: "#fff" }} />}
							id={t.id}
							key={i}
							smooth
							classes={{
								root: classes.tab
							}}
							label={t.label}
							to={`${t.url}`} />
					}) : null}
				</Tabs> : null}
				{width === "xs" ? <div className={classes.dividerContainer}>
					<div className={classes.divider} />
				</div> : null}
				{noSearch ? null : <Search
					right
					suggestions={data ? suggestionGen(data) : []}
					handleFilterKeyword={handleFilterKeyword}
					searchValue={filters.keyword} />}
				{
					<ToolBar classes={{ root: classes.contentToolbar }}>
						{content}
					</ToolBar>
				}
			</AppBar>
		)
	}
}

export default withWidth()(withStyles(styles)(Toolbar))
