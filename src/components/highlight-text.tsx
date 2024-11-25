export function HighlightText({ text, keyword, className }: { text?: string; keyword?: string; className?: string }) {
	return (
		<span className={className}>
			{text && keyword
				? text.split(keyword).map((txt, index) => (
						<>
							{index > 0 && <span className="text-red-500">{keyword}</span>}
							<span>{txt}</span>
						</>
				  ))
				: text}
		</span>
	)
}
