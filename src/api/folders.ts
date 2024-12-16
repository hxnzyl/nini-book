import { LocalTable } from '@/lib/local-table'
import TreeUtils from '@/lib/tree'
import { UserNoteFolderPO } from '@/types/po/UserNoteFolderPO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'

export const FoldersTable = new LocalTable('folders', UserNoteFolderPO)

export const getFolders = async (): Promise<[UserNoteFolderVO[], UserNoteFolderVO[]]> => {
	const pos = await FoldersTable.getAll()
	if (!pos.length) {
		// Initialization
		pos[0] = await FoldersTable.insert({
			id: '0',
			name: 'My Folder',
			lvl: 1,
			pid: '',
			isFavorite: 0
		})
	}
	const map = (po: UserNoteFolderPO): UserNoteFolderVO => ({
		...po,
		isAdd: false,
		isEdit: false,
		isFolder: true,
		isMenu: false,
		children: []
	})
	return [
		// .sort((prev, next) => prev.name.localeCompare(next.name))
		TreeUtils.from(
			pos.filter((po) => !po.deleteFlag),
			map
		),
		pos.filter((po) => po.deleteFlag).map(map)
	]
}
