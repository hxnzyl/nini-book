import { MenuVO } from '@/types/vo/MenuVO'
import { UserVO } from '@/types/vo/UserVO'

export async function getUser(): Promise<UserVO> {
	return Promise.resolve({
		id: '1',
		name: 'nini',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
		createTime: new Date().toLocaleString()
	})
}

export async function getMenus(): Promise<MenuVO[]> {
	return Promise.resolve([
		{
			id: '1',
			name: 'Book',
			icon: 'book',
			isMenu: true,
			isFolder: false,
			children: [
				{
					id: '11',
					pid: '1',
					name: 'Latest',
					icon: 'sparkles',
					isMenu: true,
					isFolder: false,
					children: []
				},
				{
					id: '12',
					pid: '1',
					name: 'Recycle',
					icon: 'recycle',
					isMenu: true,
					isFolder: false,
					children: []
				},
				{
					id: '13',
					pid: '1',
					name: 'Favorite',
					icon: 'star',
					isMenu: true,
					isFolder: false,
					children: []
				}
			]
		},
		{
			id: '2',
			name: 'Attendance',
			icon: 'timer',
			isMenu: true,
			isFolder: false,
			children: [
				{
					id: '21',
					pid: '2',
					name: 'Day',
					icon: 'calendar-days',
					isMenu: true,
					isFolder: false,
					children: []
				},
				{
					id: '22',
					pid: '2',
					name: 'Month',
					icon: 'calendar-fold',
					isMenu: true,
					isFolder: false,
					children: []
				}
			]
		}
	])
}
