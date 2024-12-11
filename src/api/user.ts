import { MenuVO } from '@/types/vo/MenuVO'
import { UserVO } from '@/types/vo/UserVO'

export async function getUser(): Promise<UserVO> {
	return Promise.resolve({
		id: '1',
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
		createTime: new Date().toLocaleString()
	})
}

export async function getMenus(): Promise<MenuVO[]> {
	return Promise.resolve([
		{
			id: '1',
			name: 'Latest',
			icon: 'sparkles',
			date: '',
			isMenu: true,
			isFolder: false
		},
		{
			id: '2',
			name: 'Recycle',
			icon: 'recycle',
			date: '',
			isMenu: true,
			isFolder: false
		},
		{
			id: '3',
			name: 'Favorite',
			icon: 'star',
			date: '',
			isMenu: true,
			isFolder: false
		}
	])
}
