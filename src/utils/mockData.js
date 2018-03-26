
import faker from 'faker'

var _ = require('lodash')
var Projects = []
_.range(0, 150).map(p => {

	return Projects.push({ id: p, name: faker.address.city(), progress: faker.random.number({ min: 0, max: 100 }), date: faker.date.between("2015-01-01", "2020-12-31"), responsible: faker.name.lastName(), img: 'https://picsum.photos/1920/1404/?random=' + p })

})

var Projekter = []

_.range(0, 150).map(p => {

	return Projekter.push({
		id: p,
		address: faker.address.city() + ' ' + faker.address.zipCode() + ' ' + faker.address.streetName(),
		title: faker.name.lastName(),
		description: faker.lorem.words(20),
		open_date: faker.date.between("2015-01-01", "2015-01-31"),
		user: { name: faker.name.lastName(), img: 'https://picsum.photos/30/30/?random=' + p },
		tags: [p, p, p],
		devices: [p, p + 1, p + 2],
		progress: faker.random.number({ min: 0, max: 100 }),
		hits: faker.random.number({ min: 0, max: 100000 }),
		img: "https://picsum.photos/1920/1080/?random" + p,
		seneste_reg: faker.date.between("2015-01-01", "2017-12-31"),
	})
})

export default Projekter
// export default Projects


