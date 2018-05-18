import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyledCheckbox, CheckMarkIco } from './CheckboxStyles'

class Checkbox extends Component {

	handleChange = () => {

		console.log(this.props.onChange)
		if (this.props.onChange) {
			this.props.onChange(!this.props.isChecked)
		}

	}

	render() {
		const { size } = this.props
		return (
			<StyledCheckbox size={size} style={{ ...this.props.style }}>
				<input
					type="checkbox"
					checked={this.props.isChecked}
					onClick={this.handleChange}
				/>
				<CheckMarkIco className="checkmark" size={size}></CheckMarkIco>
			</StyledCheckbox>
		)
	}
}

Checkbox.propTypes = {
	checked: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium']),
	onChange: PropTypes.func,
}

Checkbox.defaultProps = {
	checked: false,
	size: 'small'
}

export default Checkbox
