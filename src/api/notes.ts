import { LocalTable } from '@/lib/local-table'
import { UserNoteFilePO } from '@/types/po/UserNoteFilePO'
import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'

export const NotesTable = new LocalTable('notes', UserNoteFilePO)

export const getNotes = async () => {
	const pos = await NotesTable.getAll()
	const ret: [UserNoteFileVO[], UserNoteFileVO[]] = [[], []]
	for (const po of pos) {
		ret[po.deleteFlag ? 1 : 0].push({
			...po,
			isFile: true,
			isAdd: false,
			isEdit: false
		})
	}
	return ret
}
