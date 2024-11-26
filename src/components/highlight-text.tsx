import StringUtils from '@/lib/string';
import { escape } from 'lodash-es';

/**
 * Highlight Text based on keyword
 *
 * @param param0
 * @returns
 */
export function HighlightText({
	text,
	keyword,
	className,
	caseInsensitive = true
}: Readonly<{ text?: string; keyword?: string; className?: string; caseInsensitive?: boolean }>) {
	if (StringUtils.isEmpty(text) || StringUtils.isEmpty(keyword)) {
		// Empty text or Empty keyword
		return <span className={className}>{text}</span>
	}
	if (caseInsensitive) {
		// Case Insensitive
		const __html = escape(text).replace(
			new RegExp(`(${escape(keyword)})`, 'i'),
			'<span class="text-red-500 font-semibold">$1</span>'
		)
		return <span className={className} dangerouslySetInnerHTML={{ __html }}></span>
	}
	// Case Sensitive
	return (
		<span className={className}>
			{text.split(keyword).map((txt, key) => (
				<span key={key}>
					{key > 0 && <span className="text-red-500 font-semibold">{keyword}</span>}
					<span>{txt}</span>
				</span>
			))}
		</span>
	)
}
