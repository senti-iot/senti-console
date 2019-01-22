import React, { Component, Fragment } from 'react'
import FilterInput from 'components/Table/FilterInput'
import FilterCard from 'components/Table/FilterCard'
import { connect } from 'react-redux'
import { MenuItem, MenuList, ClickAwayListener, Paper, Popper, Grow } from '@material-ui/core'
import { addFilter, editFilter, removeFilter } from 'redux/appState'

class FilterToolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			openMenu: false,
			actionAnchor: null,
			focusedMenu: -1,
			error: false
		}
	}
	componentWillUnmount = () => {
		this.input.removeEventListener('keypress', this.handleMenuNav, false)
	}
	
	handleClick = e => {
		if (this.state.actionAnchor === null) {
			this.setState({ actionAnchor: this.input });
			this.input.addEventListener('keypress', this.handleMenuNav, false)
			this.input.focus()
		}
		else {
			this.setState({ actionAnchor: null })
		}
	}

	handleClose = () => {
		this.setState({ actionAnchor: null });
	}

	onBeforeAdd(chip) {
		if (chip.length >= 3)
			return true
		else { 
			this.setState({ error: true })
			return false
		}
	}

	handleDoubleClick = chip => {
		const { filters, chips, reduxKey } = this.props
		let allChips = chips[reduxKey]
		let editChip = allChips[allChips.findIndex(c => c.id === chip.id)]
		let editFilter = filters[filters.findIndex(f => f.key === editChip.key)]
		this.setState({ editFilter: editFilter, editChip })
	}
	handleMenuNav = e => {
		if (this.state.actionAnchor !== null)
		{
			const { filters } = this.props
			const { focusedMenu } = this.state
			switch (e.keyCode) {
				case 13:
					const ft = filters[focusedMenu]
					if (ft)
						this.setState({ [ft.name]: true, actionAnchor: null, focusedMenu: -1 })
					break;
				case 40: //keyboard down
					this.setState({ focusedMenu: focusedMenu === filters.length - 1  ?  0 : focusedMenu + 1 })
					break;
				case 38: //keyboard up
					this.setState({ focusedMenu: focusedMenu === 0 ? filters.length - 1 : focusedMenu - 1 })
					break;
				case 27:
					this.setState({ actionAnchor: null, focusedMenu: -1 })
					break;
				default:
					break;
			}
		}
		else {
			if ( e.keyCode === 40)
				this.handleClick()
		}
	}
	handleAdd = (displayValue, value, key, type, icon, name) => {
		const { addFilter, reduxKey } = this.props
		if (this.onBeforeAdd(value)) { 
			this.setState({ [name]: false })
			addFilter({ value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey)
		}
	}
	handleEdit = (displayValue, value, key, type, icon, id) => { 
		const { editFilter, reduxKey } = this.props
		editFilter({ id, value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey)
	}
	handleDelete = (deletedChip, i) => {
		const { removeFilter, reduxKey } = this.props
		removeFilter(deletedChip.id, reduxKey)

	}
	isSelected = id => this.state.focusedMenu === id ? true : false
	render() {
		const { t, filters, reduxKey } = this.props
		const { actionAnchor, editChip, editFilter } = this.state
		return (
			<ClickAwayListener onClickAway={this.handleClose} style={{ margin: '4px 0px' }}>
				<Fragment>
					<FilterInput
						inputRef={ref => this.input = ref}
						value={this.props.chips[reduxKey]}
						onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
						onBeforeDelete={this.handleClose}
						handleDoubleClick={this.handleDoubleClick}
						onAdd={(displayValue, value, key) => this.handleAdd(displayValue, value, key)}
						onDelete={(deletedChip, i) => this.handleDelete(deletedChip, i)}
						onClick={this.handleClick}
						dataSourceConfig={{ id: 'id', text: 'displayValue', value: 'displayValue' }}
						fullWidth
						t={t}
					/>
					<Popper
						open={actionAnchor ? true : false}
						anchorEl={actionAnchor}
						transition
						disablePortal
						style={{ zIndex: 1028 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps} timeout={350}>
								<Paper onClick={e => e.stopPropagation()} >
									<MenuList>
										{filters ? filters.map((ft, i) => {
											return <MenuItem selected={this.isSelected(i)} key={i} onClick={() => { this.setState({ [ft.name]: true, openMenu: false }) }}>
												{ft.name}
											</MenuItem>
										}) : null}
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
						edit
						value={editChip.value}
						handleButton={(displayValue, value, icon) => { this.handleEdit(displayValue, value, editFilter.key, editFilter.type, icon, editChip.id) }}
						handleClose={() => this.setState({ editFilter: false, editChip: null })}
					/> : null}
					{filters ? filters.map((ft, i) => {
						return <FilterCard
							resetError={() => {console.log('error reset');this.setState({ error: false })}}
							error={this.state.error}
							key={i}
							open={this.state[ft.name]}
							anchorEl={this.input}
							title={ft.name}
							type={ft.type}
							options={ft.options}
							content={ft.content}
							handleButton={(displayValue, value, icon) => { this.handleAdd(displayValue, value, ft.key, ft.type, icon, ft.name) }}
							handleClose={() => this.setState({ [ft.name]: false })}
						/>
					}) : null}
				</Fragment>
			</ClickAwayListener>
		)
	}
}
const mapStateToProps = (state) => ({
	chips: state.appState.filters
})


const mapDispatchToProps = (dispatch) => ({
	addFilter: (filter, type) => dispatch(addFilter(filter, type)),
	editFilter: (filter, type) => dispatch(editFilter(filter, type)),
	removeFilter: (filter, type) => dispatch(removeFilter(filter, type))
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterToolbar)
