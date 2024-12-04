import DateUtils from '@/lib/date'
import { LocalTable } from '@/lib/local-table'
import TreeUtils from '@/lib/tree'
import { UserNoteFolderPO } from '@/types/po/UserNoteFolderPO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'

export const FoldersTable = new LocalTable<UserNoteFolderPO>('folders')

export const getFolders = async (): Promise<[UserNoteFolderVO[], UserNoteFolderVO[]]> => {
	const pos = await FoldersTable.getAll()
	if (!pos.length) {
		// Initialization
		pos[0] = await FoldersTable.insert({
			id: '0',
			name: 'My Folder',
			lvl: 1,
			pid: '',
			date: DateUtils.getCurrentDate(),
			isRecycle: 0,
			isFavorite: 0
		})
	}
	const map = (po: UserNoteFolderPO): UserNoteFolderVO => ({
		...po,
		isFolder: 1,
		isMenu: 0,
		children: []
	})
	return [
		TreeUtils.from(
			pos.filter((po) => !po.isRecycle),
			map
		),
		pos.filter((po) => po.isRecycle).map(map)
	]
}

export const addFolder = (folders: UserNoteFolderVO) => {
	if (folders.isAdd != null) {
		return FoldersTable.insert({
			id: folders.id,
			name: folders.name,
			lvl: folders.lvl,
			pid: folders.pid,
			date: folders.date,
			isRecycle: 0,
			isFavorite: 0
		})
	}
}

export const updateFolder = (folders: UserNoteFolderVO) => {
	if (folders.id != null) {
		return FoldersTable.update({
			id: folders.id,
			name: folders.name,
			lvl: folders.lvl,
			pid: folders.pid,
			date: folders.date,
			isRecycle: folders.isRecycle,
			isFavorite: folders.isFavorite
		})
	}
}
