import React, { Component } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';

class DashboardPanel extends Component {
	render() {
		const { d } = this.props
		return (
			<DashboardCard 
				header={d.name}
				img={imgs.data}
				content={d.description}
				c={d.color}
			/>
		)
	}
}

export default DashboardPanel
