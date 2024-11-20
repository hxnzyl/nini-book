import { HomeContext } from '@/contexts/home'
import { Redo2, Undo2 } from 'lucide-react'
import Quill, { QuillOptions } from 'quill'
import QuillModuleHistory from 'quill/modules/history'
import QuillModuleToolbar from 'quill/modules/toolbar'
import { useContext, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './editor.css'

const quillOptions: QuillOptions = {
	theme: 'snow',
	modules: {
		history: {
			delay: 2000, // 2s记录一次操作历史
			maxStack: 200 // 最大记录200次操作历史
		},
		toolbar: {
			container: [
				// undo/redo/clean
				['undo', 'redo', 'clean'],
				// font size, font family
				[{ header: [false, 1, 2, 3, 4, 5, 6] }, { font: [] }],
				// font style
				['bold', 'italic', 'underline', 'strike'],
				// color
				[{ color: [] }, { background: [] }],
				// block
				['blockquote', 'code-block'],
				// media
				['link', 'image', 'video', 'formula'],
				// list style
				[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }, { align: [] }],
				// outdent/indent
				[{ indent: '-1' }, { indent: '+1' }],
				// superscript/subscript
				[{ script: 'sub' }, { script: 'super' }],
				// text direction
				[{ direction: 'rtl' }]
			],
			handlers: {
				undo() {
					const _this = this as unknown as QuillModuleToolbar
					const history = _this.quill.getModule('history') as QuillModuleHistory
					history.undo()
				},
				redo() {
					const _this = this as unknown as QuillModuleToolbar
					const history = _this.quill.getModule('history') as QuillModuleHistory
					history.redo()
				}
			}
		}
	}
}

export default function HomeEditor() {
	const editorRef = useRef<HTMLDivElement>(null)
	const { activeNote } = useContext(HomeContext)
	const [quill, setQuill] = useState<Quill | undefined>()

	// mounted
	useEffect(() => {
		// #region componentDidMount
		const editor = editorRef.current
		if (!editor) return

		// Create an element to store Quill Editor
		const container = document.createElement('div')
		editor.appendChild(container)

		// Create Quill Editor
		const quillEditor = new Quill(container, quillOptions)

		// Get toolbar module
		const tollbar = quillEditor.getModule('toolbar') as QuillModuleToolbar
		if (!tollbar.container) return

		// Calculate content height
		const toolbarHeight = tollbar.container.offsetHeight || 0
		const editorHeight = editor.offsetHeight || 0
		const contentHeight = editorHeight - toolbarHeight

		// Set container height, fixed height allows the scrollbar to appear naturally.
		quillEditor.container.style.height = contentHeight + 'px'

		// Set editor min height, leave blank space below the editing area.
		quillEditor.root.style.minHeight = contentHeight - 1 + 'px'

		// Add icon undo component to undo button element
		const undo = tollbar.container!.querySelector('.ql-undo')
		if (undo) createRoot(undo).render(<Undo2></Undo2>)

		// Add icon redo component button element
		const redo = tollbar.container!.querySelector('.ql-redo')
		if (redo) createRoot(redo).render(<Redo2></Redo2>)

		setQuill(quillEditor)
		// #endregion componentDidMount

		// #region componentWillUnmount
		// return () => {}dddd
		// #endregion componentDidMount
	}, [])

	// watch
	useEffect(() => {
		if (quill && activeNote) {
			quill.setText(activeNote.teaser)
		}
	}, [quill, activeNote])

	return (
		<div ref={editorRef} className="home-editor w-full h-full overflow-hidden">
			{/** the contents will be replaced by Quill. */}
		</div>
	)
}
