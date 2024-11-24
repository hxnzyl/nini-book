import { UserNoteFileVO } from '@/types/vo/UserNoteFileVO'
import { UserNoteFolderVO } from '@/types/vo/UserNoteFolderVO'

export async function getFolders(): Promise<UserNoteFolderVO> {
	return Promise.resolve({
		id: '00',
		name: 'My Folder',
		isFolder: 1,
		lvl: 1,
		pid: '',
		children: [
			{
				id: '01',
				name: 'Folder 1',
				isFolder: 1,
				lvl: 2,
				pid: '00',
				children: [
					{
						id: '03',
						name: 'Folder 3',
						isFolder: 1,
						lvl: 3,
						pid: '01'
					}
				]
			},
			{
				id: '02',
				name: 'Folder 2',
				isFolder: 1,
				lvl: 2,
				pid: '00'
			}
		]
	})
}

export async function getNotes(): Promise<UserNoteFileVO[]> {
	return Promise.resolve([
		{
			id: '0',
			name: 'Meeting Tomorrow',
			date: '09:34 AM',
			content:
				'Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.',
			userNoteFolderId: '00',
			isFile: 1,
			isLatest: 0,
			isRecycle: 1,
			isFavorite: 0
		},
		{
			id: '1',
			name: 'Re: Project Update',
			date: 'Yesterday',
			content:
				"Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
			userNoteFolderId: '00',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '2',
			name: 'Weekend Plans',
			date: '2 days ago',
			content:
				"Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
			userNoteFolderId: '00',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '3',
			name: 'Re: Question about Budget',
			date: '2 days ago',
			content:
				"I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
			userNoteFolderId: '00',
			isFile: 1,
			isLatest: 1,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '4',
			name: 'Important Announcement',
			date: '1 week ago',
			content:
				"Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
			userNoteFolderId: '01',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '5',
			name: 'Re: Feedback on Proposal',
			date: '1 week ago',
			content:
				"Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
			userNoteFolderId: '01',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 1
		},
		{
			id: '6',
			name: 'New Project Idea',
			date: '1 week ago',
			content:
				"I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
			userNoteFolderId: '01',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 1
		},
		{
			id: '7',
			name: 'Vacation Plans',
			date: '1 week ago',
			content:
				"Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
			userNoteFolderId: '01',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '8',
			name: 'Re: Conference Registration',
			date: '1 week ago',
			content:
				"I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
			userNoteFolderId: '02',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '9',
			name: 'Team Dinner',
			date: '1 week ago',
			content:
				"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
			userNoteFolderId: '02',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		},
		{
			id: '10',
			name: 'Team Dinner',
			date: '1 week ago',
			content:
				"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
			userNoteFolderId: '02',
			isFile: 1,
			isLatest: 0,
			isRecycle: 0,
			isFavorite: 0
		}
	])
}
