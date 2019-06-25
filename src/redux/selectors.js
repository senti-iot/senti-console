import { createSelector } from 'reselect'
import { setMinutelyData, setHourlyData, setDailyData, setSummaryData } from 'components/Charts/DataModel';

export const getCompares = state => state.dateTime.compares
export const getDGraph = (state, props) => {
	if (props.create) {
		let gs = state.dsSystem.cGraphs
		let g = gs[gs.findIndex(r => r.id === props.id)]
		return g
	}
	let gs = state.dsSystem.graphs
	let g = gs[gs.findIndex(r => r.id === props.id)]
	return g
}
// export const getEditGraph = state => state.dsSystem.eGraph


export const getSGraph = createSelector(
	[getDGraph], (g) => g
)

export const getAllCompares = createSelector(
	[getCompares], (compares) => { 
		let newCompares = compares.map(c => {
			switch (c.timeType) {
				case 0:
					return setMinutelyData([c], c.from, c.to, c.hoverID, { id: c.id, display: c.display })
				case 1: 
					return setHourlyData([c], c.from, c.to, c.hoverID, { id: c.id, display: c.display })
				case 2: 
					return setDailyData([c], c.from, c.to, c.hoverID, { id: c.id, display: c.display })
				case 3: 
					return setSummaryData([c], c.from, c.to, c.hoverID, { id: c.id, display: c.display })
				default:
					return null
			}
		})
		return newCompares
	}

)