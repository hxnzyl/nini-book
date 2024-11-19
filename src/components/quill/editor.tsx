import { Redo2, Undo2 } from 'lucide-react'
import Quill, { History, QuillOptions } from 'quill'
import Toolbar from 'quill/modules/toolbar'
import { useEffect, useRef } from 'react'
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
					const _this = this as unknown as Toolbar
					const history: History = _this.quill.getModule('history')
					history.undo()
				},
				redo() {
					const _this = this as unknown as Toolbar
					const history: History = _this.quill.getModule('history')
					history.redo()
				}
			}
		}
	}
}

export default function QuillEditor() {
	const editorRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// componentWillMount
		const editor = editorRef.current
		const container = document.createElement('div')
		editor?.appendChild(container)
		const quill = new Quill(container, quillOptions)
		const tollbar = quill.getModule('toolbar') as Toolbar
		if (!tollbar.container) return
		const toolbarHeight = tollbar.container.offsetHeight || 0
		const containerHeight = quill.container.offsetHeight || 0
		// Set container height, fixed height allows the scrollbar to appear naturally.
		quill.container.style.height = containerHeight - toolbarHeight + 'px'
		// Set editor min height, leave blank space below the editing area.
		quill.root.style.minHeight = containerHeight - toolbarHeight - 1 + 'px'
		const undo = tollbar.container.querySelector('.ql-undo')
		if (undo) createRoot(undo).render(<Undo2></Undo2>)
		const redo = tollbar.container.querySelector('.ql-redo')
		if (redo) createRoot(redo).render(<Redo2></Redo2>)
		// componentWillUnmount
		// return () => {}dddd
	})

	return (
		<div ref={editorRef} className="quill-editor flex-1 overflow-hidden">
			{/** the contents will be replaced by Quill. */}
		</div>
	)
}
