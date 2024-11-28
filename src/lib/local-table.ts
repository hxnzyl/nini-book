import localforage from 'localforage'

export const createLocalTable = (storeName: string) =>
	localforage.createInstance({ driver: localforage.INDEXEDDB, name: 'nini-book', version: 3, storeName })

export class LocalTable<PO extends { id: string }> {
	private table: LocalForage

	constructor(table: string | LocalForage) {
		this.table = typeof table === 'string' ? createLocalTable(table) : table
	}

	getOne(key: string): Promise<PO | null> {
		return this.table.getItem(key)
	}

	getAll(): Promise<PO[]> {
		return new Promise((resolve) => {
			const pos: PO[] = []
			this.table.iterate(
				(value: PO) => {
					pos.push(value)
				},
				() => {
					resolve(pos)
				}
			)
		})
	}

	insert(dto: PO): PO {
		this.table.setItem(dto.id, dto)
		return dto
	}
}
