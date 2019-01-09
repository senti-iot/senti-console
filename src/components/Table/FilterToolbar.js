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
			actionAnchor: null
		}
		// this.input = React.createRef()
	}
	
	handleClick = e => {
		if (this.state.actionAnchor === null) {
			this.setState({ actionAnchor: this.input });
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

	handleAdd = (displayValue, value, key, type) => {
		let id = this.props.addFilter({ value, key, type })
		let chipObj = {
			id: id,
			value: displayValue
		}
		// chip.id = id
		this.setState({
			chips: [...this.state.chips, chipObj]
		})
		
	}

	handleDelete = (deletedChip, i) => {
		this.props.removeFilter(deletedChip)
		this.setState({
			chips: this.state.chips.filter((c) => c.id !== deletedChip)
		})
	
	}
	render() {
		const { t } = this.props
		const { actionAnchor } = this.state
		return (
			<ClickAwayListener onClickAway={this.handleClose}>
				<Fragment>
					<FilterInput
					// {...this.props}
						inputRef={ref => this.input = ref}
						value={this.state.chips}
						// onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
						onAdd={(displayValue, value, key) => this.handleAdd(displayValue, value, key)}
						onDelete={(deletedChip, i) => this.handleDelete(deletedChip, i)}
						onClick={this.handleClick}
						// onBlur={this.handleClose}
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
											return <MenuItem key={i} onClick={() => { this.setState({ [ft.name]: true, openMenu: false }) }}>
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
							content={ft.content}
							handleButton={(displayValue, value) => { this.handleAdd(displayValue, value, ft.key, ft.type) }}
							handleClose={() => this.setState({ [ft.name]: false })}
						/>
					}) : null}
				</Fragment>
			</ClickAwayListener>
		)
	}
}

export default FilterToolbar
