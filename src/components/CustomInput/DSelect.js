import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { FormControl, withStyles, Select, MenuItem, InputLabel, OutlinedInput } from '@material-ui/core';
import { ItemG } from 'components';

// Replace withStyles with withTheme, remove styles

const styles = theme => ({
	label: {
		color: theme.palette.type === 'dark' ? "#fff" : undefined
	},
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 230
	},
});
 
class DSelect extends Component {
	componentDidMount = () => {
	  this.setState({ labelWidth: ReactDOM.findDOMNode(this.InputRef).offsetWidth })
	}
	
	labelWidth = () => {
		if (this.InputRef) {
			return this.state.labelWidth
		}
		else {
			return 100
		}
	}
	render() {
	  const { classes, error, value, onKeyPress, margin, onChange, menuItems, label, theme, fullWidth, leftIcon } = this.props
	  let mobile = window.innerWidth < theme.breakpoints.values.md ? true : false
	 
		return (
	 <FormControl variant="outlined" margin={margin} className={classes.formControl} fullWidth={mobile || fullWidth}>
			 <InputLabel ref={ref => {
					this.InputRef = ref;
				}}
				 FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
					{label}
				</InputLabel>
				<Select
					variant={'outlined'}
					fullWidth={mobile || fullWidth}
					value={value}
					error={error}
					onChange={onChange}
					input={<OutlinedInput labelWidth={this.labelWidth()} variant={'outlined'} classes={{ root: classes.label }} />}
					onKeyPress={onKeyPress}
				>
					{menuItems.map((m, i) => {
						return <MenuItem key={i} value={m.value}>
							<ItemG container justify={'space-between'} alignItems={'center'}>
								{leftIcon ? <ItemG style={{ display: 'flex', marginRight: 8 }}>{m.icon ? m.icon : null}</ItemG> : null}
								<ItemG xs>{m.label}</ItemG>
								{!leftIcon ? <ItemG>{m.icon ? m.icon : null}</ItemG> : null}
							</ItemG>
						</MenuItem>
					})}
					})}
				</Select>
			</FormControl>
		)
	}
}

export default withStyles(styles, { withTheme: true })(DSelect)