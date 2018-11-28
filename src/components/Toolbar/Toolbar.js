

import React, { PureComponent } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';

const styles = theme => ({
	appBar: {
		display: 'flex',
		flexFlow: 'row',
		justifyContent: 'space-between',
		maxWidth: '100%',
		overflow: 'visible',
		minHeight: 48,
		height: 48,
		zIndex: 1300
	},
	contentToolbar: { 
		height: 41,
		minHeight: 41,
		maxHeight: 41,
		paddingLeft: 0,
		marginLeft: 'auto',
	},
	dividerContainer: {
		marginLeft: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
	},
	divider: {
		width: 2,
		height: 32,
		background: 'rgb(255, 255, 255, 0.5)',
	},
	noOverflow: {
		overflow: 'hidden'
	},
})

class Toolbar extends PureComponent {
	constructor(props) {
	  super(props)
	
	  this.state = {
			route: props.route ? props.route : 0	 
	  }
		this.tabsRef = React.createRef()
		
	}
	componentDidMount = () => {
		if (this.props.width === 'xs') { 
			this.tabsRef.tabsRef.scroll({ left: 100, behavior: 'smooth' }) 
			setTimeout(() => {
				this.tabsRef.tabsRef.scroll({ left: 0, behavior: 'smooth' }) 
			}, 300);
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
				{tabs ? <Tabs innerRef={ref => this.tabsRef = ref} value={this.state.route} scrollable={width === 'xs' ? true : undefined} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
					{tabs ? tabs.map((t, i) => {
						return <Tab title={t.title}
							component={(props) => <Link {...props} scroll={this.handleScroll } style={{ color: '#fff' }} />}
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
				{noSearch ? null : <Search
					right
					suggestions={data ? suggestionGen(data) : []}
					handleFilterKeyword={handleFilterKeyword}
					searchValue={filters.keyword} />}
				{content ? <ToolBar classes={{ root: classes.contentToolbar }}>
					{content}
				</ToolBar> : null}
			</AppBar>
		)
	}
}

export default withWidth()(withStyles(styles)(Toolbar))
