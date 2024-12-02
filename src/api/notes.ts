import { LocalTable } from '@/lib/local-table'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'

export const NotesTable = new LocalTable<UserNoteFilePO>('notes')

export const getNotes = (): Promise<UserNoteFileVO[]> => {
	return new Promise((resolve) => {
		NotesTable.getAll().then((pos) => {
			resolve(
				pos.map((po) => ({
					...po,
					isFile: 1
				}))
			)
		})
	})
}

export const updateNote = (note: UserNoteFileVO) => {
	if (note.id != null) {
		return NotesTable.update({
			id: note.id,
			name: note.name,
			date: note.date,
			content: note.content,
			isLatest: note.isLatest,
			isRecycle: note.isRecycle,
			isFavorite: note.isFavorite,
			userNoteFolderId: note.userNoteFolderId
		})
	}
}
