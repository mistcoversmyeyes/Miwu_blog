import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryPathUrl, getCategoryUrl } from "@utils/url-utils.ts";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export type CategoryNode = {
	name: string;
	count: number;
	url: string;
	path: string[];
	children: CategoryNode[];
};

function getCategoryPath(post: CollectionEntry<"posts">): string[] {
	if (Array.isArray(post.data.categories) && post.data.categories.length > 0) {
		return post.data.categories.map((segment) => String(segment).trim()).filter(Boolean);
	}
	if (post.data.category && post.data.category.trim()) {
		return [post.data.category.trim()];
	}
	return [];
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const root = new Map<string, CategoryNode>();

	for (const post of allBlogPosts) {
		const categoryPath = getCategoryPath(post);
		if (categoryPath.length === 0) continue;

		let currentLevel = root;
		const prefix: string[] = [];
		for (const segment of categoryPath) {
			prefix.push(segment);
			const key = segment.toLowerCase();
			let node = currentLevel.get(key);
			if (!node) {
				node = {
					name: segment,
					count: 0,
					url: getCategoryPathUrl(prefix),
					path: [...prefix],
					children: [],
				};
				currentLevel.set(key, node);
			}
			node.count += 1;

			const childMap = new Map<string, CategoryNode>(
				node.children.map((child) => [child.name.toLowerCase(), child]),
			);
			currentLevel = childMap;
			node.children = Array.from(childMap.values());
		}
	}

	function sortTree(nodes: CategoryNode[]): CategoryNode[] {
		for (const node of nodes) {
			node.children = sortTree(node.children);
		}
		return nodes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
	}

	return sortTree(Array.from(root.values()));
}

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		const categoryPath = getCategoryPath(post);
		if (categoryPath.length === 0) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName = categoryPath.join(" / ");

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
