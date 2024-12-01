import DateUtils from '@/lib/date'
import { LocalTable } from '@/lib/local-table'
import { UserNoteFolderPO } from '@/types/po/UserNoteFolderPO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'

export const FoldersTable = new LocalTable<UserNoteFolderPO>('folders')

export const getFolders = (): Promise<UserNoteFolderVO> => {
	return new Promise((resolve) => {
		FoldersTable.getAll().then((pos) => {
			const PO2VO = (po: UserNoteFolderPO): UserNoteFolderVO => ({
				...po,
				isFolder: 1,
				children: pos.filter((folder) => folder.pid === po.id).map(PO2VO)
			})
			resolve(
				PO2VO(
					pos.find((folder) => folder.lvl == 1) ||
						FoldersTable.insert({
							id: '0',
							name: 'My Folder',
							lvl: 1,
							pid: '',
							date: DateUtils.getCurrentDate()
						})
				)
			)
		})
	})
}

export const addFolder = (folders: UserNoteFolderVO) => {
	if (folders.isNew != null) {
		FoldersTable.insert({
			id: folders.id,
			name: folders.name,
			lvl: folders.lvl,
			pid: folders.pid,
			date: folders.date
		})
	}
}
