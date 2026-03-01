import { visit, SKIP } from "unist-util-visit";
import type { Root, Parent } from "mdast";

const TYPE_MAPPING: Record<string, string> = {
	note: "note",
	tip: "tip",
	warning: "warning",
	danger: "caution",
	caution: "caution",
	important: "important",
	info: "note",
	success: "tip",
	failure: "warning",
	bug: "warning",
	example: "note",
	quote: "note",
	question: "note",
};

function inlineText(node: any): string {
	if (!node) return "";
	if (node.type === "text") return node.value ?? "";
	if (Array.isArray(node.children)) {
		return node.children.map((child: any) => inlineText(child)).join("");
	}
	return "";
}

export function remarkMkdocsAdmonitions() {
	return (tree: Root) => {
		visit(tree, "paragraph", (node: any, index: number | undefined, parent: Parent | undefined) => {
			if (!parent || typeof index !== "number") return;

			const firstChild = node.children[0];
			if (firstChild?.type !== "text") return;
			const markerMatch = firstChild.value.match(/^!!!\s+(\w+)\s*/);
			if (!markerMatch) return;

			// 把当前段落在第一个换行处分成 header/body，避免吞掉后续 sibling 节点
			const headerNodes: any[] = [];
			const bodyNodes: any[] = [];
			let seenNewline = false;
			for (const child of node.children) {
				if (child.type !== "text") {
					(seenNewline ? bodyNodes : headerNodes).push(child);
					continue;
				}
				if (!seenNewline) {
					const newlineIndex = child.value.indexOf("\n");
					if (newlineIndex === -1) {
						headerNodes.push(child);
						continue;
					}
					const before = child.value.slice(0, newlineIndex);
					const after = child.value.slice(newlineIndex + 1);
					if (before) {
						headerNodes.push({ ...child, value: before });
					}
					if (after) {
						bodyNodes.push({ ...child, value: after });
					}
					seenNewline = true;
					continue;
				}
				bodyNodes.push(child);
			}

			const markerTextNode = headerNodes[0];
			if (markerTextNode?.type !== "text") return;
			const match = markerTextNode.value.match(/^!!!\s+(\w+)\s*(.*)$/);
			if (!match) return;

			const [, mkdocsType] = match;
			const type = TYPE_MAPPING[mkdocsType.toLowerCase()] || "note";

			// 从 header 第一段 text 中移除 !!! 前缀，剩余部分作为标题的一部分
			const markerPrefix = markerTextNode.value.match(/^!!!\s+\w+\s*/)?.[0] ?? "";
			const firstTitleText = markerTextNode.value.slice(markerPrefix.length);
			if (firstTitleText) {
				headerNodes[0] = { ...markerTextNode, value: firstTitleText };
			} else {
				headerNodes.shift();
			}

			const titleRaw = headerNodes.map((n: any) => inlineText(n)).join("").trim();
			let title: string | null = null;
			if (titleRaw) {
				const titleMatch = titleRaw.match(/^"([^"]+)"$/);
				if (titleMatch) {
					title = titleMatch[1];
				} else {
					title = titleRaw;
				}
			}

			const children: any[] = [];
			if (title) {
				children.push({
					type: "paragraph",
					data: { directiveLabel: true },
					children: [{ type: "text", value: title }],
				});
			}

			if (bodyNodes.length > 0) {
				children.push({
					type: "paragraph",
					children: bodyNodes,
				});
			} else {
				children.push({ type: "paragraph", children: [] });
			}

			// 兜底：若上游把多段文本折叠成一个段落，按空行拆回 sibling，避免后续 !!! 被吞并
			const extraParagraphs: any[] = [];
			if (
				children.length > 1 &&
				children[1].type === "paragraph" &&
				children[1].children?.length === 1 &&
				children[1].children[0]?.type === "text"
			) {
				const bodyTextNode = children[1].children[0];
				const bodyText = bodyTextNode.value ?? "";
				const splitRe = /\n[ \t]*\n+/g;
				const segments = bodyText
					.split(splitRe)
					.map((s: string) => s.trim())
					.filter(Boolean);
				if (segments.length > 1) {
					children[1].children = [{ ...bodyTextNode, value: segments[0] }];
					for (let i = 1; i < segments.length; i++) {
						extraParagraphs.push({
							type: "paragraph",
							children: [{ type: "text", value: segments[i] }],
						});
					}
				}
			}

			const directiveNode: any = {
				type: "containerDirective",
				name: type,
				attributes: {},
				children,
			};

			parent.children.splice(index, 1, directiveNode);
			if (extraParagraphs.length > 0) {
				parent.children.splice(index + 1, 0, ...extraParagraphs);
			}

			return SKIP;
		});
	};
}
