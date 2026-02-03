import { deflateRawSync } from "node:zlib";
import { visit } from "unist-util-visit";

type PlantumlOptions = {
	server?: string;
	format?: "svg" | "png";
	className?: string;
	alt?: string;
};

const DEFAULT_SERVER = "https://www.plantuml.com/plantuml";

function encode6bit(value: number): string {
	if (value < 10) return String.fromCharCode(48 + value);
	value -= 10;
	if (value < 26) return String.fromCharCode(65 + value);
	value -= 26;
	if (value < 26) return String.fromCharCode(97 + value);
	value -= 26;
	if (value === 0) return "-";
	if (value === 1) return "_";
	return "?";
}

function append3bytes(b1: number, b2: number, b3: number): string {
	const c1 = b1 >> 2;
	const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
	const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
	const c4 = b3 & 0x3f;
	return (
		encode6bit(c1 & 0x3f) +
		encode6bit(c2 & 0x3f) +
		encode6bit(c3 & 0x3f) +
		encode6bit(c4 & 0x3f)
	);
}

function encode64(data: Uint8Array): string {
	let result = "";
	for (let i = 0; i < data.length; i += 3) {
		if (i + 2 === data.length) {
			result += append3bytes(data[i], data[i + 1], 0);
		} else if (i + 1 === data.length) {
			result += append3bytes(data[i], 0, 0);
		} else {
			result += append3bytes(data[i], data[i + 1], data[i + 2]);
		}
	}
	return result;
}

function encodePlantuml(source: string): string {
	const compressed = deflateRawSync(Buffer.from(source, "utf8"));
	return encode64(compressed);
}

function normalizeSource(raw: string): string {
	const trimmed = raw.trim();
	if (!trimmed) return trimmed;
	if (/@start\w+/i.test(trimmed)) return trimmed;
	return `@startuml\n${trimmed}\n@enduml`;
}

export function remarkPlantuml(options: PlantumlOptions = {}) {
	const server = (options.server ?? DEFAULT_SERVER).replace(/\/+$/, "");
	const format = options.format ?? "svg";
	const className = options.className ?? "plantuml-diagram";
	const alt = options.alt ?? "PlantUML diagram";

	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (!parent || typeof index !== "number") return;
			const lang = (node.lang ?? "").toLowerCase();
			if (lang !== "puml" && lang !== "plantuml") return;

			const normalized = normalizeSource(String(node.value ?? ""));
			if (!normalized) return;

			const encoded = encodePlantuml(normalized);
			const src = `${server}/${format}/${encoded}`;
			const html = `<div class="${className}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /></div>`;
			parent.children[index] = { type: "html", value: html };
		});
	};
}
