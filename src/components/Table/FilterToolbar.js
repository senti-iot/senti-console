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
	handleMenuNav = e => {
		// console.log(e)
		console.log(e.keyCode)
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
		console.log(displayValue, value, key, type, icon)
		let id = this.props.addFilter({ value, key, type: type ? type : null })
		let chipObj = {
			id: id,
			icon: icon,
			value: displayValue
		}
		// chip.id = id
		this.setState({
			chips: [...this.state.chips, chipObj]
		})

	}

	handleDelete = (deletedChip, i) => {
		this.props.removeFilter(deletedChip.id)
		this.setState({
			chips: this.state.chips.filter((c) => c.id !== deletedChip.id)
		})

	}
	isSelected = id => this.state.focusedMenu === id ? true : false
	render() {
		const { t } = this.props
		const { actionAnchor } = this.state
		return (
			<ClickAwayListener onClickAway={this.handleClose}>
				<Fragment>
					<FilterInput
						inputRef={ref => this.input = ref}
						value={this.state.chips}
						onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
						onBeforeDelete={this.handleClose}
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
						style={{ zIndex: 1050 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps} timeout={350}>
								<Paper onClick={e => e.stopPropagation()} >
									<MenuList>
										{this.props.filters ? this.props.filters.map((ft, i) => {
											return <MenuItem selected={this.isSelected(i)} key={i} onClick={() => { this.setState({ [ft.name]: true, openMenu: false }) }}>
												{ft.name}
											</MenuItem>
										}) : null}
									</MenuList>
								</Paper>
							</Grow>)}
					</Popper>
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
