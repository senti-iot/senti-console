import { servicesAPI } from './data';

export const getAllRegistries = async () => {
	let data = await servicesAPI.get('/v1/1/registries').then(rs => rs.ok ? rs.data : null)
	return data
}