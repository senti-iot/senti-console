import React, { Component, Fragment } from 'react'
import { Fade } from '@material-ui/core';
import { CircularLoader } from 'components';

class FadeOutLoader extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			showLoader: false
		}
	}
	componentDidUpdate = async (prevProps, prevState) => {
		if ((prevProps.on !== this.props.on) && this.props.on) {
			console.log('turn on cdu', prevProps.on, this.props.on)
			await  this.execute(true)
		}
		if ((prevProps.on !== this.props.on) && !this.props.on) {
			await this.execute(false)
		 }
	}
	execute = async (on) => {
		// console.log(on)
		if (on) {
			this.setState({ loading: true })
			setTimeout(async () => {
				this.setState({ showLoader: on })
				await this.props.onChange()
				this.setState({ loading: false })
			}, 1000);
		}
		else { 
			this.setState({ loading: false, showLoader: false })
		}
		// this.setState({ loading: false })
	}
	render() {
		const { children, notCentered, circularClasses } = this.props
		const { loading, showLoader } = this.state
		return (
			<Fragment>
				<Fade in={!loading}>
					{!showLoader ? 
						 children 
						: <CircularLoader notCentered={notCentered} className={circularClasses}/>}
				</Fade>
			</Fragment>
		)
	}
}

export default FadeOutLoader
