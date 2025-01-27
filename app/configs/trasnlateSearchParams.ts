import { parseAsString, parseAsStringEnum } from 'nuqs'
import languages from './languages'

const languageCodes = languages.map((language) => language.value)

const trasnlateSearchParams = {
	source_lang: parseAsStringEnum(languageCodes).withDefault('en'),
	target_lang: parseAsStringEnum(languageCodes).withDefault('zh'),
	text: parseAsString.withDefault(''),
}

export default trasnlateSearchParams
