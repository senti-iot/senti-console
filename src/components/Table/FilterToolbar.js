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

	handleAdd = (chip, value, key) => {
		let id = this.props.addFilter({ value: value, key: key })
		let chipObj = {
			id: id,
			value: chip
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
		return (
			<Fragment>
				<FilterInput
					// {...this.props}
					inputRef={ref => this.input = ref}
					value={this.state.chips}
					onBeforeAdd={(chip) => this.onBeforeAdd(chip)}
					onAdd={(chip) => this.handleAdd(chip)}
					onDelete={(deletedChip, i) => this.handleDelete(deletedChip, i)}
					onClick={this.handleClick}
					dataSourceConfig={{ id: 'id', text: 'value', value: 'value' }}
					fullWidth
					t={t}
				/>
				<Menu
					id='simple-menu'
					anchorEl={this.input}
					open={this.state.openMenu}
					onClose={this.handleClose}
				>
					{this.props.filters ? this.props.filters.map((ft, i) => {
						return <MenuItem key={i} onClick={() => { this.setState({ [ft.name]: true, openMenu: false }) }}>
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
						handleButton={(title, value) => { this.handleAdd(title, value, ft.key) }}
						handleClose={() => this.setState({ [ft.name]: false })}
					/>
				}) : null}
			</Fragment>
		)
	}
}

export default FilterToolbar
