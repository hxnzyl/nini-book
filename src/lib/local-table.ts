import localforage from 'localforage'

export const createLocalTable = (storeName: string) =>
	localforage.createInstance({ driver: localforage.INDEXEDDB, name: 'nini-book', storeName })

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
				(po: PO) => {
					pos.push(po)
				},
				() => {
					resolve(pos)
				}
			)
		})
	}

	async insert(dto: PO): Promise<PO> {
		this.table.setItem(dto.id, dto)
		return dto
	}

	async update(dto: PO): Promise<PO> {
		const po = await this.getOne(dto.id)
		const newPo = { ...po, ...dto }
		this.table.setItem(dto.id, newPo)
		return newPo
	}

	remove(dto: PO) {
		this.table.removeItem(dto.id)
	}

	removeById(id: string) {
		this.table.removeItem(id)
	}
}
