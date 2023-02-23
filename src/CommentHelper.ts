import { Editor } from "obsidian";

function commentType(codeBlockType: string) {
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
		"jsonc",
		"dataviewjs",
	];
	const hashTypes = ["python", "ruby", "bash", "zsh", "sh", "applescript", "yaml", "yml"];
	const lua = ["lua", "sql"];
	const html = ["html", "xml", "md"];
	const templater =["templater"]

	const types = {
		cLikeTypes: cLikeTypes,
		hashTypes: hashTypes,
		lua: lua,
		html: html,
		templater: templater,
	};


	for (const [name, values] of Object.entries(types)) {
		if (values.includes(codeBlockType.toLowerCase())) {
			return name;
		}
	}

	return "unknown";
}

export function commentSelection(
	editor: Editor,
	selection: string,
	codeBlockType: string | null
) {
	let commentedSelection = "";

	if (codeBlockType) {
		
		const varName = commentType(codeBlockType);
		if (varName === "cLikeTypes") {
			const pattern = /^\/\/\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
			}
		} else if (varName === "hashTypes") {
			const pattern = /^#\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `# $1`);
			}
		} else if (varName === "lua") {
			const pattern = /^--\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `-- $1`);
			}
		} else if (varName === "html"){
			const pattern = /^<!--\s?(.*)\s?-->$/gms;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(
					/^(.*)$/gms,
					`<!-- $1  -->`
				);
			}
		}		if (varName === "cLikeTypes") {
			const pattern = /^\/\/\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
			}
		}else if (varName === "templater") {
			const pattern = /^\/\/\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
			}
		}else {
			return
		}
	} else {
		const pattern = /^%%(.*)%%$/gms;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(pattern, `$1`);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gms, `%%$1%%`);
		}
	}


	const {pi, pr} = getPosToOffset(editor, selection)
	const from = editor.offsetToPos(pi);
	const to = editor.offsetToPos(pr);

	editor.replaceRange(commentedSelection, from, to);
}

export function getPosToOffset(editor:Editor, sel:string) {
	let i = editor.getCursor("from");
	let r = editor.getCursor("to");
	let pi = editor.posToOffset(i);
	let pr = editor.posToOffset(r);

	if (pi === pr) {
		const curs = editor.getCursor();
		const line = curs.line;
		const value = sel = editor.getLine(line);
		i = { line: line, ch: 0 };
		r = { line: line, ch: value.length };
		pi = editor.posToOffset(i);
		pr = editor.posToOffset(r);
	}
	return {pi,pr,sel}
}