import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProjectCard from './ProjectCard';
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
			projects.map(p => 
				<ProjectCard t={t} key={p.id} p={p}/>
			)

		)
	}
}

export default ProjectCards
