import React, { Component, Fragment } from 'react'
import FilterInput from 'components/Table/FilterInput'
import FilterCard from 'components/Table/FilterCard'
import { connect } from 'react-redux'
import { MenuItem, MenuList, ClickAwayListener, Paper, Popper, Grow } from '@material-ui/core'
import { addFilter, editFilter, removeFilter, changeEH } from 'redux/appState'

class FilterToolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			openMenu: false,
			actionAnchor: null,
			focusedMenu: -1,
			error: false,
			openFilterCard: false
		}
	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.handleMenuNav, false)
		window.removeEventListener('keydown', this.handleWindowKeyPress, false)
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.eH !== this.props.eH) { 
			if (this.props.eH) {
				window.addEventListener('keydown', this.handleWindowKeyPress, false)
			}
			else { 
				window.removeEventListener('keydown', this.handleWindowKeyPress, false)
			}
		}
	}
	
	componentDidMount = () => {
		window.addEventListener('keydown', this.handleWindowKeyPress, false)
	}
	
	handleClick = e => {
		window.removeEventListener('keydown', this.handleWindowKeyPress, false)
		if (this.state.actionAnchor === null) {
			this.setState({ actionAnchor: this.chip.chipRef });
			window.addEventListener('keydown', this.handleMenuNav, false)
			// this.input.focus()
		}
		else {
			window.addEventListener('keydown', this.handleWindowKeyPress, false)
			this.setState({ actionAnchor: null })
		}
	}
	handleBlur = () => {
		window.removeEventListener('keydown', this.handleMenuNav, false)
		window.addEventListener('keydown', this.handleWindowKeyPress, false)
	}
	handleFocus = () => { 
		window.addEventListener('keydown', this.handleMenuNav, false)
		window.removeEventListener('keydown', this.handleWindowKeyPress, false)
	}
	handleClose = () => {
		window.addEventListener('keydown', this.handleWindowKeyPress, false)
		this.setState({ actionAnchor: null })
	}
	handleWindowKeyPress = e => {
		const { actionAnchor, openFilterCard } = this.state
		if (actionAnchor === null && e.keyCode === 70 && !openFilterCard) {
			e.preventDefault()
			this.handleClick()
		}
	}
	onBeforeAdd(chip) {
		if (typeof chip === 'string')
			if (chip.length >= 2)
				return true
			else {
				this.setState({ error: true })
				setTimeout(() => {
					this.setState({ error: false })
				}, 500);
				return false
			}
		else {
			return true
		}
	}

	handleDoubleClick = chip => {
		const { filters, chips, reduxKey } = this.props
		let allChips = chips[reduxKey]
		let editChip = allChips[allChips.findIndex(c => c.id === chip.id)]
		let editFilter = filters[filters.findIndex(f => {
			return f.key === editChip.key && f.type === editChip.type
		})]
		this.setState({ editFilter: editFilter, editChip }, () => { this.props.disableEH()})
	}
	handleMenuNav = e => {
		if (this.state.actionAnchor !== null) {
			const { filters } = this.props
			const { focusedMenu, actionAnchor } = this.state
			switch (e.keyCode) {
				case 13:
					const ft = filters[focusedMenu]
					if (ft)
						this.setState({ [ft.name]: true, actionAnchor: null, focusedMenu: -1, openFilterCard: true })
					break;
				case 40: //keyboard down
					this.setState({ focusedMenu: focusedMenu === filters.length - 1 ? 0 : focusedMenu + 1 })
					break;
				case 38: //keyboard up
					this.setState({ focusedMenu: focusedMenu === 0 ? filters.length - 1 : focusedMenu - 1 })
					break;
				case 27:
					window.addEventListener('keydown', this.handleWindowKeyPress, false)
					this.setState({ actionAnchor: null, focusedMenu: -1 })
					break;
				default:
					if (actionAnchor !== null) {
						this.setState({ actionAnchor: null })
					}
					break;
			}
			e.stopPropagation()
		}
		else {
			if (e.keyCode === 40)
				this.handleClick()
			if (e.keyCode === 27) {
				this.input.blur()
				this.handleBlur()
			}
		}
	}
	handleAdd = (displayValue, value, key, type, icon, name) => {
		const { addFilter, reduxKey } = this.props
		if (this.onBeforeAdd(value)) {
			this.setState({ [name]: false, openFilterCard: false })
			addFilter({ value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey)
		}
	}
	handleEdit = (displayValue, value, key, type, icon, id) => {
		const { editFilter, reduxKey } = this.props
		editFilter({ id, value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey)
		this.setState({ editFilter: false, editChip: null }, () => { this.props.enableEH()})
	}
	handleDelete = (deletedChip) => {
		const { removeFilter, reduxKey } = this.props
		removeFilter(deletedChip, reduxKey)
	}
	handleMenuItem = ft => {
		this.setState({ [ft]: true, openMenu: false, openFilterCard: true })
	}

	isSelected = id => this.state.focusedMenu === id ? true : false

	render() {
		const { t, filters, reduxKey } = this.props
		const { actionAnchor, editChip, editFilter } = this.state
		return (
			<ClickAwayListener onClickAway={this.handleClose} style={{ margin: '4px 0px' }}>
				<Fragment>
					<FilterInput
						onBlur={this.handleBlur}
						inputRef={ref => this.input = ref}
						chipRef={ref => this.chip = ref}
						value={this.props.chips[reduxKey]}
						onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
						onBeforeDelete={this.handleClose}
						handleDoubleClick={this.handleDoubleClick}
						onFocus={this.handleFocus}
						onAdd={(displayValue, value, key) => this.handleAdd(displayValue, value, key)}
						onDelete={(deletedChip, i) => this.handleDelete(deletedChip, i)}
						handleClick={this.handleClick}
						dataSourceConfig={{ id: 'id', text: 'displayValue', value: 'displayValue' }}
						placeholder={t('actions.search')}
						fullWidth
						t={t}
					/>
					<Popper
						open={actionAnchor ? true : false}
						anchorEl={actionAnchor}
						placement="bottom-start"
						transition
						disablePortal
						modifiers={{
							hide: {
								enabled: false
							  },
							flip: {
							  enabled: false,
							},
							preventOverflow: {
							  enabled: false,
							  boundariesElement: 'scrollParent',
							}
						}}
						onClose={() => this.setState({ actionAnchor: null })}
						style={{ zIndex: 1028, marginTop: 8 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps} timeout={350} style={{ position: "absolute",
								top: 0 }}>
								<Paper onClick={e => e.stopPropagation()} >
									<MenuList>
										{filters ? filters.map((ft, i) =>
											ft.hidden ? null :
												<MenuItem selected={this.isSelected(i)} key={i} onClick={() => this.handleMenuItem(ft.name)}>
													{ft.name}
												</MenuItem>
										) : null}
									</MenuList>
								</Paper>
							</Grow>)}
					</Popper>
					{editFilter ? <FilterCard
						open={editFilter ? true : false}
						anchorEl={this.input}
						title={editFilter.name}
						type={editFilter.type}
						options={editFilter.options}
						content={editFilter.content}
						hidden={editFilter.hidden}
						edit
						value={editChip.value}
						handleButton={(displayValue, value, icon) => { this.handleEdit(displayValue, value, editFilter.key, editFilter.type, icon, editChip.id) }}
						handleClose={() => this.setState({ editFilter: false, editChip: null })}
					/> : null}
					{filters ? filters.map((ft, i) => {
						return <FilterCard
							resetError={() => this.setState({ error: false })}
							error={this.state.error}
							key={i}
							open={this.state[ft.name]}
							anchorEl={this.input}
							title={ft.name}
							hidden={ft.hidden}
							type={ft.type}
							options={ft.options}
							content={ft.content}
							handleButton={(displayValue, value, icon) => { this.handleAdd(displayValue, value, ft.key, ft.type, icon, ft.name) }}
							handleClose={() => this.setState({ [ft.name]: false, openFilterCard: false })}
						/>
					}) : null}
				</Fragment>
			</ClickAwayListener>
		)
	}
}
const mapStateToProps = (state) => ({
	chips: state.appState.filters,
	eH: state.appState.EH
})


const mapDispatchToProps = (dispatch) => ({
	addFilter: (filter, type) => dispatch(addFilter(filter, type)),
	editFilter: (filter, type) => dispatch(editFilter(filter, type)),
	removeFilter: (filter, type) => dispatch(removeFilter(filter, type)),
	disableEH: () => dispatch(changeEH(false)),
	enableEH: () => dispatch(changeEH(true))
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterToolbar)
