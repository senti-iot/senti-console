import React, { Component, Fragment } from 'react'
import FilterInput from 'components/Table/FilterInput';
import FilterCard from 'components/Table/FilterCard';
import { Menu, MenuItem } from '@material-ui/core'
class FilterToolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chips: [],
			openMenu: false
		}
		this.input = React.createRef()
	}
	handleClick = () => {
		this.setState({  openMenu: true });
	};

	handleClose = () => {
		this.setState({ openMenu: false });
	};

	onBeforeAdd(chip) {
		return chip.length >= 3
	}

	handleAdd = (chip) => {
		this.setState({
			chips: [...this.state.chips, chip]
		})
	}

	handleDelete = (deletedChip) => {
	
		this.setState({
			chips: this.state.chips.filter((c) => c !== deletedChip)
		})
	
	}
	render() {
		return (
			<Fragment>
				<FilterInput
					{...this.props}
					inputRef={ref => this.input = ref}
					value={this.state.chips}
					onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
					onAdd={(chip) => this.handleAdd(chip)}
					onDelete={(deletedChip) => this.handleDelete(deletedChip)}
					onClick={this.handleClick}
					fullWidth
				/>
				<Menu
					id='simple-menu'
					anchorEl={this.input}
					open={this.state.openMenu}
					onClose={this.handleClose}
				>
					{this.props.filters ? this.props.filters.map(ft => {
						return <MenuItem key={ft.id} onClick={() => { this.setState({ [ft.name]: true, openMenu: false }) }}>
							{ft.name}
						</MenuItem>
					}) : null}
				</Menu>

				{this.props.filters ? this.props.filters.map(ft => {
					return <FilterCard
						key={ft.id}
						open={this.state[ft.name]}
						anchorEl={this.input}
						title={ft.name}
						type={ft.type}
						content={ft.content}
						handleButton={(value) => { this.handleAdd(value); ft.func(ft.name) }}
						handleClose={() => this.setState({ [ft.name]: false })}
					/>
				}) : null}
			</Fragment>
		)
	}
}

export default FilterToolbar
