import { LocalTable } from '@/lib/local-table'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'

export const NotesTable = new LocalTable<UserNoteFilePO>('notes')

export const getNotes = (): Promise<UserNoteFileVO[]> => {
	return new Promise((resolve) => {
		NotesTable.getAll().then((pos) => {
			console.log(pos)
			resolve(
				pos.map((po) => ({
					...po,
					isFile: 1
				}))
			)
		})
	})
}
