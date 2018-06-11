import React, { Component } from 'react'
import { getAllProjects } from '../../variables/data';
import { Grid } from "@material-ui/core";

import { RegularCard, /* Table, */ ItemGrid } from "components";
import ProjectList from 'components/List/ProjectList';

export default class Projekter extends Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			projectHeader: []
		}
	}
	componentDidMount = async () => {
		var projects = await getAllProjects()
		// var proje = projects.map(p => {
		// 	delete p.user
		// 	delete p.id
		// 	delete p.img
		// 	return Object.values(p)
		// })
		this.setState({ projects: projects, projectHeader: ['Title', 'Description', 'Open Date', 'Close Date', 'Progress', 'Created', 'Last Modified'] })
	}

	render() {
		return (
			<Grid container>
				<ItemGrid xs={12} sm={12} md={12}>
					<RegularCard
						cardTitle="All projects"
						cardSubtitle=""
						content={
							<ProjectList
								items={this.state.projects}
							/>
							// <Table
							// tableHeaderColor="primary"
							// tableHead={this.state.projectHeader}
							// tableData={this.state.projects
							// }
							// />
						}
					/>
				</ItemGrid>
			</Grid>
		)
	}
}
