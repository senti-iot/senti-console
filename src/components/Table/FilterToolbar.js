import React, { Component, Fragment } from 'react'
import FilterInput from 'components/Table/FilterInput';
import FilterCard from 'components/Table/FilterCard';
import { MenuItem, MenuList, ClickAwayListener, Paper, Popper, Grow } from '@material-ui/core'
class FilterToolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chips: [],
			openMenu: false,
			actionAnchor: null,
			focusedMenu: -1
		}
		// this.input = React.createRef()
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
	};

	handleClose = () => {
		this.setState({ actionAnchor: null });
	};

	onBeforeAdd(chip) {
		return chip.length >= 3
	}
	handleDoubleClick = chip => {
		const { filters } = this.props
		// console.log(chip)
		let chips = this.state.chips
		let editChip = chips[chips.findIndex(c => c.id === chip.id)]
		let editFilter = filters[filters.findIndex(f => f.key === editChip.key)]
		// console.log(editFilter)
		this.setState({ editFilter: editFilter, editChip })
	}
	handleMenuNav = e => {
		// console.log(e)
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
	handleAdd = (displayValue, value, key, type, icon) => {
		let id = this.props.addFilter({ value, key, type: type ? type : null })
		let chipObj = {
			key: key, 
			type: type,
			id: id,
			icon: icon,
			value: displayValue,
			actualVal: value
		}
		// chip.id = id
		this.setState({
			chips: [...this.state.chips, chipObj]
		})
	}
	handleEdit = (displayValue, value, key, type, icon, id) => { 
		this.props.editFilter({ id, value, key, type: type ? type : null })
		let chips = this.state.chips
		let chipIndex = chips.findIndex(c => c.id === id)
		chips[chipIndex] = {
			key: key,
			type: type,
			id: id,
			icon: icon,
			value: displayValue,
			actualVal: value
		}
		this.setState({ chips })
	}
	handleDelete = (deletedChip, i) => {
		this.props.removeFilter(deletedChip.id)
		this.setState({
			chips: this.state.chips.filter((c) => c.id !== deletedChip.id)
		})

	}
	isSelected = id => this.state.focusedMenu === id ? true : false
	render() {
		const { t, filters } = this.props
		const { actionAnchor, editChip, editFilter } = this.state
		// console.log(editChip, editFilter)
		return (
			<ClickAwayListener onClickAway={this.handleClose} style={{ margin: '4px 0px' }}>
				<Fragment>
					<FilterInput
						inputRef={ref => this.input = ref}
						value={this.state.chips}
						onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
						onBeforeDelete={this.handleClose}
						handleDoubleClick={this.handleDoubleClick}
						// onKeyPress={(e, ) => this.handleAdd(chip.value, chip.value, chip.id)}
						onAdd={(displayValue, value, key) => this.handleAdd(displayValue, value, key)}
						onDelete={(deletedChip, i) => this.handleDelete(deletedChip, i)}
						onClick={this.handleClick}
						dataSourceConfig={{ id: 'id', text: 'value', value: 'value' }}
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
						value={editChip.actualVal}
						handleButton={(displayValue, value, icon) => { this.handleEdit(displayValue, value, editFilter.key, editFilter.type, icon, editChip.id) }}
						handleClose={() => this.setState({ editFilter: false, editChip: null })}
					/> : null}
					{this.props.filters ? this.props.filters.map((ft, i) => {
						return <FilterCard
							key={i}
							open={this.state[ft.name]}
							anchorEl={this.input}
							title={ft.name}
							type={ft.type}
							options={ft.options}
							content={ft.content}
							handleButton={(displayValue, value, icon) => { this.handleAdd(displayValue, value, ft.key, ft.type, icon) }}
							handleClose={() => this.setState({ [ft.name]: false })}
						/>
					}) : null}
				</Fragment>
			</ClickAwayListener>
		)
	}
}

export default FilterToolbar
