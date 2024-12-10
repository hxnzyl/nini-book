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
			pos.filter((po) => !po.isRecycle).sort((prev, next) => prev.name.localeCompare(next.name)),
			map
		),
		pos.filter((po) => po.isRecycle).map(map)
	]
}

export const deleteFolder = (folder: UserNoteFolderVO) => {
	if (folder.id != null) {
		FoldersTable.removeById(folder.id)
	}
}

export const addFolder = (folder: UserNoteFolderVO) => {
	if (folder.isAdd != null) {
		return FoldersTable.insert({
			id: folder.id,
			name: folder.name,
			lvl: folder.lvl,
			pid: folder.pid,
			date: folder.date,
			isRecycle: 0,
			isFavorite: 0
		})
	}
}

export const updateFolder = (folder: UserNoteFolderVO) => {
	if (folder.id != null) {
		return FoldersTable.update({
			id: folder.id,
			name: folder.name,
			lvl: folder.lvl,
			pid: folder.pid,
			date: folder.date,
			isRecycle: folder.isRecycle,
			isFavorite: folder.isFavorite
		})
	}
}
