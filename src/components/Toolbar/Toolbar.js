

import React, { Component } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';

const styles = theme => ({
	appBar: {
		display: 'flex',
		flexFlow: "row",
		justifyContent: 'space-between',
		// top: 70,
		minHeight: 48,
		height: 48,
		zIndex: 1300
	},
	noOverflow: {
		overflow: 'visible'
	},
})

class Toolbar extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
			route: props.defaultRoute ? props.defaultRoute : 0	 
	  }
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	render() {
		const { classes, tabs, data, noSearch, filters, handleFilterKeyword, content } = this.props
		return (
			<AppBar position={'sticky'} classes={{ root: classes.appBar }}>
				{tabs ? <Tabs value={this.state.route} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
					{tabs ? tabs.map((t, i) => {
						return <Tab title={t.title}
							component={(props) => <Link {...props} scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })} style={{ color: "#fff" }}/>}
							id={t.id}
							key={i}
							smooth
							label={t.label}
							to={`${t.url}`} />
					}) : null}
				
			
				</Tabs> : null}
				{noSearch ? null : <Search
					right
					suggestions={data ? suggestionGen(data) : []}
					handleFilterKeyword={handleFilterKeyword}
					searchValue={filters.keyword} />}
				{
					content ? <ToolBar classes={{ root: classes.appBar }}>
						{content}
					</ToolBar> : null
				}
			</AppBar>
		)
	}
}

export default withStyles(styles)(Toolbar)
