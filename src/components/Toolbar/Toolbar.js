

import React, { PureComponent } from 'react'
import { AppBar, Tabs, Tab, withStyles, Toolbar as ToolBar, withWidth } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen } from 'variables/functions'
import { NavHashLink as Link } from 'react-router-hash-link';
import inView from 'in-view'

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
			route: props.route ? props.route : 0
		}
		this.tabsRef = React.createRef()

	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	
	componentDidUpdate = () => {
		const { tabs } = this.props
		if (tabs && this._isMounted)
			tabs.map(t => {
				if (t.url.includes('#')) {
					return inView(t.url).on('enter', el =>  {
						this.setState({ route: t.id })
					})
				}
				else
					return null
			})
	}
	componentDidMount = () => {
		inView.offset({
			top: 118,
			right: 0,
			bottom: 0,
			left: 0
		});
		this._isMounted = 1
		// inView.threshold(0.85)
		// const { tabs } = this.props
		// if (tabs)
		// 	tabs.map(t => {
		// 		console.log(this.state.route)
		// 		if (t.url.includes('#')) {
		// 			console.log(document.getElementById(t.url.substring(1, t.url.length)))
		// 			// console.log(inView.is(document.getElementById(t.url.substring(1, t.url.length))))
		// 			return inView(t.url).on('enter', () => this.setState({ route: t.id }));
		// 		}
		// 		else
		// 			return null
		// 	})
	}

	handleTabsChange = (e, value) => {
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
					{tabs ? <Tabs innerRef={ref => this.tabsRef = ref} value={this.state.route} variant={width === 'xs' ? 'scrollable' : undefined} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
						{tabs ? tabs.map((t, i) => {
							return <Tab title={t.title}
								component={(props) => <Link {...props} scroll={this.handleScroll} style={{ color: '#fff' }} />}
								id={t.id}
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
