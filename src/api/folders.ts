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
					pos.find((folder) => folder.lvl == 1) || FoldersTable.insert({ id: '0', name: 'My Folder', lvl: 1, pid: '' })
				)
			)
		})
	})
}
