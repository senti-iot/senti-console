

import React, { Component } from 'react'
import { AppBar, Tabs, Tab, withStyles } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'

const styles = theme => ({
	appBar: {
		height: 48,
		zIndex: 1000
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
		const { props } = this
		return (
			<AppBar position={'sticky'} classes={{ root: props.classes.appBar }}>
				<Tabs value={this.state.route} onChange={this.handleTabsChange} classes={{ fixed: props.classes.noOverflow, root: props.classes.noOverflow }}>
					{props.tabs ? props.tabs.map((t, i) => {
						return <Tab title={t.title} id={t.id} key={i} label={t.label} onClick={() => props.history.push(`${t.url}`)}/>
					}) : null}
					<Search
						right
						suggestions={props.data ? suggestionGen(props.data) : []}
						handleFilterKeyword={props.handleFilterKeyword}
						searchValue={props.filters.keyword} />
				</Tabs>
			</AppBar>
		)
	}
}

export default withStyles(styles)(Toolbar)
