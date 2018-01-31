import {playMode} from '@/config/playMode'
import cache from '@/util/localStorageUtil'
const state = {
	singer : {},
	playing:false,
	fullScreen:false,
	playlist:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:-1,
	historylist:cache.get('__history__')||[],
}

export default state
