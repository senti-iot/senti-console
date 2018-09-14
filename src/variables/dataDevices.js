import { api, imageApi, mapApi } from "./data";

export const getWifiHourly = async (dId, from, to) => {
	var data = await api.get('senti/project/wifihourly/' + dId + '/' + from + '/' + to).then(rs => rs.data)
	return data
}
export const getWifiSummary = async (dId, from, to) => {
	var data = await api.get('senti/project/wifisummary/' + dId + '/' + from + '/' + to).then(rs => rs.data)
	return data
}
export const getWifiDaily = async (dId, from, to) => {
	var data = await api.get('senti/project/wifidaily/' + dId + '/' + from + '/' + to).then(rs => rs.data)
	return data
}
export const getAllPictures = async (deviceId) => {
	var base64Flag = 'data:image/jpeg;base64,';
	var data = await api.get('senti/device/images/' + deviceId).then(response => {
		if (response.data) {
			var data = response.data.map(img => { return { filename: img.filename, image: base64Flag + img.image } })
			return data
		}
		else {
			return 0
		}
	})
	return data
}
export const resetDevice = async (id) => {
	var data = await api.post('/senti/resetdevice', id).then(rs => {console.log(rs); return rs.data})
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
	var data = await imageApi.post('senti/device/image/' + device.id, form, config).then(rs => rs.data)
	return data
}
export const deletePicture = async (dId, img) => {
	var data = await imageApi.delete('senti/device/image/' + dId + '/' + img).then(rs => {return rs.data})
	return data
}
export const getAvailableDevices = async (orgID) => {
	// https://betabackend.senti.cloud/rest/senti/devices/available
	var data = await api.get(orgID ? `senti/devices/available/${orgID}` : 'senti/devices/available').then(rs => rs.data)
	return data
}

export const assignProjectToDevice = async (args) => {
	var data = await api.post('senti/availabledevices', args).then(rs => rs.data)
	return data
}

export const getAllDevices = async () => {
	var data = await api.get("senti/devices").then(rs => rs.data)
	return data
}
export const getSimpleAddress = async (lat, long) => {
	var gaddress = await mapApi.get(`json?latlng=${parseFloat(lat)},${parseFloat(long)}`).then(rs => rs.data);
	if (gaddress.status === 'OK')
		return gaddress.results[0].formatted_address
	else
		return null
}
export const getDevice = async (id) => {
	var data = await api.get('senti/device/' + id).then(rs => rs.data)
	if (data.address)
		return data
	else {
		let gaddress = await mapApi.get(`json?latlng=${parseFloat(data.lat)},${parseFloat(data.long)}`).then(rs => rs.data);
		if (gaddress.status === 'OK') {
			data.address = gaddress.results[0].formatted_address
		}
	}
	return data
}
export const calibrateDevice = async (device) => {
	var data = await api.post('senti/device/calibrate', device).then(rs => { 
		return rs.ok
	})
	return data
}

export const updateDevice = async (device) => {
	var data = await api.put(`senti/device/${device.id}`, device).then(rs => {return rs.data })
	return data
}

export const updateDeviceHardware = async (device) => {
	var data = await api.put('senti/edithardware', device).then(rs => {  return rs.data })
	return data
}