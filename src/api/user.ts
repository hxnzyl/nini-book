import DateUtils from '@/lib/date'
import { MenuVO } from '@/types/vo/MenuVO'
import { UserVO } from '@/types/vo/UserVO'

export async function getUser(): Promise<UserVO> {
	return Promise.resolve({
		id: '1',
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
		date: DateUtils.getCurrentDate(),
		isRecycle: 0
	})
}

export async function getMenus(): Promise<MenuVO[]> {
	return Promise.resolve([
		{ id: '1', name: 'Latest', icon: 'sparkles', date: '', isRecycle: 0 },
		{ id: '2', name: 'Recycle', icon: 'recycle', date: '', isRecycle: 0 },
		{ id: '3', name: 'Favorite', icon: 'star', date: '', isRecycle: 0 }
	])
}
