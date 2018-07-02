import { api, imageApi, mapApi } from "./data";

export const getAllPictures = async (deviceId) => {
	var base64Flag = 'data:image/jpeg;base64,';
	var data = await api.get('senti/device/images/' + deviceId).then(response => {
		if (response.data) {
			var data = response.data.map(img => img = base64Flag + img)
			return data
		}
		else {
			return 0
		}
	})
	return data
}

export const uploadPictures = async (device) => {
	const form = new FormData();
	// var fles = device.files;
	[...device.files].map((img, index) => form.append('sentiFile[]', device.files[index]))
	var config = {
		onUploadProgress: function (progressEvent) {
			// var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			//TODO: return percent
		}
	};
	var data = await imageApi.post('senti/device/image/' + device.device_id, form, config).then(rs => rs.data)
	return data
}

export const getAvailableDevices = async () => {
	var data = await api.get('senti/availabledevices').then(rs => rs.data)
	return data
}

export const assignProjectToDevice = async (args) => {
	var data = await api.post('senti/availabledevices', args).then(rs => rs.data)
	console.log(data)
	return data
}

export const getAllDevices = async () => {
	var data = await api.get("senti/devices").then(rs => rs.data)
	return data
}

export const getDevice = async (id) => {
	var data = await api.get('senti/device/' + id).then(rs => rs.data)
	if (data.address)
		return data
	else {

		let gaddress = await mapApi.get(`json?latlng=${parseFloat(data.lat)},${parseFloat(data.long)}&key=${process.env.REACT_APP_SENTI_MAPSKEY}`).then(rs => rs.data);
		if (gaddress.status === 'OK') {
			data.address = gaddress.results[0].formatted_address
		}
	}
	return data
}
export const calibrateDevice = async (device) => {
	var data = await api.post('senti/calibrate', device).then(rs => rs.data)
	return data
}
//Get Device Registrations for Project

export const getDeviceRegistrations = async (deviceIds, pId) => {
	var data = await api.get('senti/devicereg/' + deviceIds + '/' + pId).then(rs => rs.data)
	return data ? data.sort((a, b) => a.reg_date > b.reg_date ? -1 : a.reg_date < b.reg_date ? 1 : 0) : []
}
