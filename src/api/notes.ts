import { LocalTable } from '@/lib/local-table'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'

export const NotesTable = new LocalTable<UserNoteFilePO>('notes')

export const getNotes = async (): Promise<[UserNoteFileVO[], UserNoteFileVO[]]> => {
	const pos = await NotesTable.getAll()
	return pos.reduce(
		(group, po) => (
			group[po.isRecycle ? 1 : 0].push({
				...po,
				isFile: 1
			}),
			group
		),
		[[], []] as [UserNoteFileVO[], UserNoteFileVO[]]
	)
}

export const deleteNote = (note: UserNoteFileVO) => {
	if (note.id != null) {
		NotesTable.removeById(note.id)
	}
}

export const addNote = (note: UserNoteFileVO) => {
	if (note.id != null) {
		return NotesTable.insert({
			id: note.id,
			name: note.name,
			date: note.date,
			content: note.content,
			userNoteFolderId: note.userNoteFolderId,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		})
	}
}

export const updateNote = (note: UserNoteFileVO) => {
	if (note.id != null) {
		return NotesTable.update({
			id: note.id,
			name: note.name,
			date: note.date,
			content: note.content,
			userNoteFolderId: note.userNoteFolderId,
			isLatest: note.isLatest,
			isRecycle: note.isRecycle,
			isFavorite: note.isFavorite
		})
	}
}
