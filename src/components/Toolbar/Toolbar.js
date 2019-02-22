

import React, { PureComponent } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';
// import inView from 'in-view'

const styles = theme => ({
	appBar: {
		padding: "0 !important",
		position: "fixed",
		top: 70,
		[theme.breakpoints.down('xs')]: {
			top: 48
		},
		[theme.breakpoints.up('lg')]: {
			left: 260,
			width: "calc(100vw - 260px)"
		},
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
			route: props.route ? props.route : props.hashLinks ? -1 : 0
		}
		this.tabsRef = React.createRef()

	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleObserverUpdate = (entries, observer) => {

		let el = entries[entries.findIndex(f => f.intersectionRatio > .5)]
		if (el)
			this.setState({
				route: this.props.tabs.findIndex(f => f.url.includes(el.target.id))
			})
		// if ([top, bottom, left, right].some(Boolean)) {
		// 	this.setState({
		// 		route: this.props.tabs.findIndex(f => f.url.includes(entries[0].target.id))
		// 	})
		
	};
	componentWillUnmount = () => { 
		// tabs.forEach(t => { 

		// })
		// this.obs.unobserve()
		// window.removeEventListener('scroll', this.update, false)
		// this.obs.disconnect()
	}
	componentDidUpdate = () => {

	}
	// update = () => { 
	// 	// const { tabs } = this.props
	// 	// tabs.forEach(t => {
	// 	// 	if (t.url.includes('#')) {
	// 	// 		let el = document.getElementById(t.url.substr(1, t.url.length))
	// 	// 		if (el && this.obs) {
	// 	// 			this.obs.observe(el)
	// 	// 		}
	// 	// 	}
	// 	// })
	// 	// this.obs.observe(document.getElementById('tabs'))
	// }
	componentDidMount = () => {
		// const { tabs } = this.props
		// window.addEventListener('scroll', () => alert('test'), false)
		this._isMounted = 1
		// if (tabs && this._isMounted) {
		// this.obs = new IntersectionObserver(this.handleObserverUpdate, { rootMargin: '-150px 0px -350px 0px', threshold: [0.5] })
		// window.addEventListener('scroll', this.update, false)
		// }
	}

	handleTabsChange = (e, value) => {
		if (this.props.hashLinks) { 
			return null
		}
		this.setState({ route: value })
	}

	handleScroll = el => {
		let topOfElement = el.offsetTop - 130
		window.scroll({ top: topOfElement, behavior: 'smooth' })
	}

	render() {
		const { classes, tabs, data, noSearch, filters, handleFilterKeyword, content, width } = this.props
		return (
			<div style={{ height: 48 }}>
				<AppBar classes={{ root: classes.appBar }}>
					{tabs ? <Tabs id={'tabs'} value={this.state.route} variant={width === 'xs' ? 'scrollable' : undefined} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
						{tabs ? tabs.map((t, i) => {
							return <Tab title={t.title}
								component={(props) => <Link {...props} scroll={this.handleScroll} style={{ color: '#fff' }} />}
								value={t.id}
								key={i}
								smooth
								classes={{ root: classes.tab }}
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
			</div>
		)
	}
}

export default withWidth()(withStyles(styles)(Toolbar))
