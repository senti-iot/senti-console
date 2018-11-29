import en from './en.json'
import da from './da.json'
import christmasEn from './christmas.en.json'
import christmasDa from './christmas.da.json'

let combinedEn = {
	...en,
	christmas: christmasEn

}
let combinedDa = {
	...da, 
	christmas: christmasDa
}
export default 
{		
	en: combinedEn,
	da: combinedDa
} 

