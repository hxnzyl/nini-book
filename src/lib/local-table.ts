import localforage from 'localforage'

export const createLocalTable = (storeName: string) =>
	localforage.createInstance({ driver: localforage.INDEXEDDB, name: 'nini-book', storeName })

export class LocalTableBasePO {
	id!: string
	createTime?: string
	updateTime?: string
	deleteTime?: string
	deleteFlag?: number
}

export class LocalTable<PO extends LocalTableBasePO> {
	private forage: LocalForage
	private fields: (keyof PO)[]

	constructor(table: string | LocalForage, poClass: { new (): PO }) {
		this.forage = typeof table === 'string' ? createLocalTable(table) : table
		this.fields = Object.keys(new poClass()) as (keyof PO)[]
	}

	getOne(key: string): Promise<PO | null> {
		return this.forage.getItem(key)
	}

	getAll(): Promise<PO[]> {
		return new Promise((resolve) => {
			const pos: PO[] = []
			this.forage.iterate(
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
		dto.updateTime = dto.createTime = new Date().toLocaleString()
		dto.deleteTime = ''
		dto.deleteFlag = 0
		dto = this.fields.reduce((item, field) => ((item[field] = dto[field]), item), {} as PO)
		this.forage.setItem(dto.id, dto)
		return dto
	}

	async update(dto: PO): Promise<PO> {
		dto.updateTime = new Date().toLocaleString()
		const po = await this.getOne(dto.id)
		dto = this.fields.reduce((item, field) => ((item[field] = dto[field]), item), { ...po, ...dto } as PO)
		this.forage.setItem(dto.id, dto)
		return dto
	}

	remove(dto: PO) {
		dto.deleteTime = dto.updateTime = new Date().toLocaleString()
		dto.deleteFlag = 1
		dto = this.fields.reduce((item, field) => ((item[field] = dto[field]), item), {} as PO)
		this.forage.setItem(dto.id, dto)
		return dto
	}

	restore(dto: PO) {
		dto.updateTime = new Date().toLocaleString()
		dto.deleteFlag = 0
		dto = this.fields.reduce((item, field) => ((item[field] = dto[field]), item), {} as PO)
		console.log(dto)
		this.forage.setItem(dto.id, dto)
		return dto
	}

	dispose(dto: PO) {
		this.forage.removeItem(dto.id)
	}
}
