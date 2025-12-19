/* Create a new post scaffold with folder/index.md or single file structure */

import fs from "node:fs";
import path from "node:path";

// --- Helper Functions ---

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function parseArgs(args) {
	const config = {
		title: "",
		folder: "",
		singleFile: false,
		draft: true,
		published: getDate(),
		customFields: {},
	};

	// Parse positional arguments (title is required)
	let i = 0;
	while (i < args.length && !args[i].startsWith("-")) {
		if (config.title === "") {
			config.title = args[i];
			config.folder = args[i]; // default folder = title
		}
		i++;
	}

	// Parse optional arguments
	while (i < args.length) {
		const arg = args[i];

		if (
			arg === "--folder" ||
			arg === "-f"
		) {
			if (i + 1 >= args.length) {
				throw new Error(`Missing value for ${arg}`);
			}
			config.folder = args[i + 1];
			i += 2;
		} else if (arg === "--single-file" || arg === "-S") {
			config.singleFile = true;
			i++;
		} else if (arg === "--draft" || arg === "-d") {
			if (i + 1 >= args.length) {
				throw new Error(`Missing value for ${arg}`);
			}
			const draftValue = args[i + 1].toLowerCase();
			if (draftValue !== "true" && draftValue !== "false") {
				throw new Error(
					`Invalid draft value: ${args[i + 1]}. Must be "true" or "false"`,
				);
			}
			config.draft = draftValue === "true";
			i += 2;
		} else if (arg === "--published" || arg === "-p") {
			if (i + 1 >= args.length) {
				throw new Error(`Missing value for ${arg}`);
			}
			config.published = args[i + 1];
			i += 2;
		} else if (arg === "--field" || arg === "-F") {
			if (i + 1 >= args.length) {
				throw new Error(`Missing value for ${arg}`);
			}
			const fieldStr = args[i + 1];
			const eqIndex = fieldStr.indexOf("=");
			if (eqIndex === -1) {
				throw new Error(
					`Invalid field format: ${fieldStr}. Must be "key=value"`,
				);
			}
			const key = fieldStr.substring(0, eqIndex).trim();
			const value = fieldStr.substring(eqIndex + 1).trim();
			config.customFields[key] = value;
			i += 2;
		} else if (arg === "--help" || arg === "-h") {
			printHelp();
			process.exit(0);
		} else {
			throw new Error(`Unknown argument: ${arg}`);
		}
	}

	return config;
}

function validateConfig(config) {
	if (!config.title) {
		throw new Error("Title is required");
	}
	if (!config.folder) {
		config.folder = config.title; // fallback
	}

	// Basic folder validation - remove file extensions if present
	config.folder = config.folder.replace(/\.(md|mdx)$/i, "");

	return config;
}

function generateFrontmatter(config) {
	const lines = ["---"];

	// Required fields - follow existing article order
	lines.push(`title: "${escapeYamlString(config.title)}"`);
	lines.push(`published: ${config.published}`);

	// Optional fields in the order they appear in existing articles
	const fieldOrder = [
		"description",
		"image",
		"tags",
		"category",
		"draft",
		"lang",
	];

	// Default values for each field
	const defaultValues = {
		description: "",
		image: "",
		tags: [],
		category: "",
		draft: config.draft,
		lang: "",
	};

	// Add fields in the specified order
	for (const field of fieldOrder) {
		if (config.customFields[field] !== undefined) {
			const customValue = config.customFields[field];

			// Special handling for tags: parse comma-separated string to array
			if (field === "tags" && typeof customValue === "string") {
				const tagsArray = customValue
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0);
				lines.push(`${field}: ${formatYamlValue(tagsArray)}`);
			} else {
				lines.push(`${field}: ${formatYamlValue(customValue)}`);
			}
		} else {
			lines.push(`${field}: ${formatYamlValue(defaultValues[field])}`);
		}
	}

	// Add custom fields (excluding already handled ones)
	for (const [key, value] of Object.entries(config.customFields)) {
		if (!fieldOrder.includes(key)) {
			lines.push(`${key}: ${formatYamlValue(value)}`);
		}
	}

	lines.push("---");
	return lines.join("\n");
}

function escapeYamlString(str) {
	return str.replace(/"/g, '\\"');
}

function formatYamlValue(value) {
	if (Array.isArray(value)) {
		return JSON.stringify(value);
	}
	if (typeof value === "string") {
		// Empty string should have quotes
		if (value === "") {
			return '""';
		}
		// Check if string needs quotes
		// 1. Contains special YAML characters
		// 2. Contains non-ASCII characters (e.g., Chinese, Japanese, etc.)
		// 3. Has leading/trailing whitespace
		const needsQuotes =
			value.includes(":") ||
			value.includes("#") ||
			value.includes("[") ||
			value.includes("]") ||
			value.includes("{") ||
			value.includes("}") ||
			value.includes(",") ||
			value.trim() !== value ||
			/[^\x00-\x7F]/.test(value); // Non-ASCII characters

		if (needsQuotes) {
			return `"${escapeYamlString(value)}"`;
		}
		return value;
	}
	if (typeof value === "boolean" || typeof value === "number") {
		return value.toString();
	}
	return `"${escapeYamlString(String(value))}"`;
}

function createPostFile(config) {
	const postsDir = "./src/content/posts";

	if (config.singleFile) {
		// Single file mode: create folder.md (using folder name for consistency)
		const filePath = path.join(postsDir, `${config.folder}.md`);

		if (fs.existsSync(filePath)) {
			throw new Error(`File ${filePath} already exists`);
		}

		const content = generateFrontmatter(config);
		fs.writeFileSync(filePath, content);
		return filePath;
	}
	// Folder mode: create folder/index.md (supports nested directories)
	const targetDir = path.join(postsDir, config.folder);
	const filePath = path.join(targetDir, "index.md");

	if (fs.existsSync(filePath)) {
		throw new Error(`File ${filePath} already exists`);
	}

	// Create directory if needed (recursive for nested directories)
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	const content = generateFrontmatter(config);
	fs.writeFileSync(filePath, content);
	return filePath;
}

function printHelp() {
	console.log(`Usage: npm run new-post -- <title> [options]

Create a new blog post with flexible options.

Required:
  <title>                    Article title (also used as default folder name)

Options:
  -f, --folder <string>      Custom folder name (default: title, supports nested directories)
  -S, --single-file          Create single file (folder.md) instead of folder/index.md
  -d, --draft <boolean>      Draft status (true/false, default: true)
  -p, --published <date>     Publication date (default: today, format: YYYY-MM-DD)
  -F, --field <key=value>    Custom frontmatter field (can be used multiple times)
  -h, --help                 Show this help message

Examples:
  npm run new-post -- "My New Article"
  npm run new-post -- "我的新文章" --folder "my-article"
  npm run new-post -- "Nested Post" --folder "category/subcategory/article-name"
  npm run new-post -- "My Article" --single-file --draft false
  npm run new-post -- "Tech Post" --field "category=Technology" --field "tags=编程,技术"
`);
}

// --- Main Function ---

function main() {
	try {
		const args = process.argv.slice(2);

		if (args.length === 0) {
			printHelp();
			process.exit(1);
		}

		// Parse and validate configuration
		const config = parseArgs(args);
		validateConfig(config);

		// Create the post file
		const filePath = createPostFile(config);

		console.log(`✅ Post created: ${filePath}`);
		console.log(`   Title: ${config.title}`);
		console.log(`   Folder: ${config.folder}`);
		console.log(`   Mode: ${config.singleFile ? "Single file" : "Folder"}`);
		console.log(`   Draft: ${config.draft}`);
	} catch (error) {
		console.error(`❌ Error: ${error.message}`);
		process.exit(1);
	}
}

// Run the script
main();
