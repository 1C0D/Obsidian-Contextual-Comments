type CommentResult = {
	commentedSelection: string;
	useSelection: boolean;
};

export function commentSelection({
	selection,
	codeBlockType,
}: {
	selection: string;
	codeBlockType: string | null;
}): CommentResult {
	let commentedSelection = "";
	let useSelection = false;
	const cLikeTypes = [
		"c",
		"cpp",
		"c++",
		"clike",
		"cs",
		"go",
		"java",
		"js",
		"javascript",
		"ts",
		"typescript",
		"jsx",
		"less",
		"scss",
		"css",
	];
	const hashTypes = ["python", "ruby", "bash"];
	const lua = ["lua", "sql"]; // --
	const html = ["html", "xml"]; //<!-- -->

	if (codeBlockType && cLikeTypes.includes(codeBlockType.toLowerCase())) {
		const pattern = /^(\s*\/\/\s*.*)$/gm;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(
				/^(\s*\/\/\s*)(.*)$/gm,
				`$2`
			);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
		}
	} else if (
		codeBlockType &&
		hashTypes.includes(codeBlockType.toLowerCase())
	) {
		const pattern = /^(\s*#\s*.*)$/gm;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(/^(\s*#\s*)(.*)$/gm, `$2`);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gm, `# $1`);
		}
	} else if (codeBlockType && lua.includes(codeBlockType.toLowerCase())) {
		const pattern = /^(\s*--\s+.*)$/gm;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(/^(\s*--\s+)(.*)$/gm, `$2`);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gm, `-- $1`);
		}
	} else if (codeBlockType && html.includes(codeBlockType.toLowerCase())) {
		const pattern = /^(\s*<!--\s+.+\s+-->\s*)$/gm;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(
				/^(\s*<!--\s+)(.*)(\s+-->\s*)$/gm,
				`$2`
			);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gm, `<!-- $1  -->`);
		}
	} else {
		useSelection = true;
		const pattern = /^(\s*%%\s+.+\s+%%\s*)$/gms;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(
				/^(\s*%%\s+)([^%%]*)(\s+%%\s*)$/gms,
				`$2`
			);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gms, `%% $1 %%`);
		}
	}

	return { commentedSelection, useSelection };
}
