import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProjectCard from './ProjectCard';
import { ItemG, GridContainer } from 'components';
//
class ProjectCards extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  }
	}
	
	static propTypes = {
		projects: PropTypes.array,
	}
	

	render() {
		// const { actionAnchor } = this.state
 		const { projects, t } = this.props
		return (
			<GridContainer spacing={8} justify={'center'}>
			
				{projects.map(p =>
					<ItemG container justify={'center'} xs={12} sm={6} md={4}><ProjectCard t={t} key={p.id} p={p} />	</ItemG>
				)}
			
			</GridContainer>

		)
	}
}

export default ProjectCards
