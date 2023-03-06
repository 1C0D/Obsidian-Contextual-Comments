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
		"empty",
	];
	const hashTypes = ["python", "py", "ruby", "bash", "ps1"];
	const lua = ["lua", "sql"];
	const html = ["html", "xml"];
	const css = ["css"];
	const templater = ["templater"];
	const bat = ["bat"];

	const types = {
		cLikeTypes: cLikeTypes,
		hashTypes: hashTypes,
		lua: lua,
		html: html,
		css: css,
		templater: templater,
		bat: bat,
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
		if (varName === "cLikeTypes" || varName === "templater") {
			console.log("ici")
			const pattern = /^(\s*)\/\/\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				console.log("là")
				commentedSelection = selection.replace(/^(\s*)(.*)$/gm, `$1// $2`);
			}
		} else if (varName === "hashTypes") {
			const pattern = /^(\s*)#\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				commentedSelection = selection.replace(/^(\s*)(.*)$/gm, `$1# $2`);
			}
		} else if (varName === "lua") {
			const pattern = /^(\s*)--\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				commentedSelection = selection.replace(/^(\s*)(.*)$/gm, `$1-- $2`);
			}
		} else if (varName === "bat") {
			const pattern = /^[Rr][Ee][Mm]\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `REM $1`);
			}
		} else if (varName === "css") {
			const pattern = /^\/\*\s?(.*)\s?\*\/$/gms;
			if (pattern.test(selection)) {
				console.log("ici");
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gms, `/* $1 */`);
			}
		} else if (varName === "html") {
			const pattern = /^<!--\s?(.*)\s?-->$/gms;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(
					/^(.*)$/gms,
					`<!-- $1  -->`
				);
			}
		} else {
			return;
		}
	} else {
		const pattern = /^%%(.*)%%$/gms;
		if (pattern.test(selection)) {
			commentedSelection = selection.replace(pattern, `$1`);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gms, `%%$1%%`);
		}
	}

	const { pi, pr } = getPosToOffset(editor, selection);
	const from = editor.offsetToPos(pi);
	const to = editor.offsetToPos(pr);

	editor.replaceRange(commentedSelection, from, to);
}

export function getPosToOffset(editor: Editor, sel: string) {
	let i = editor.getCursor("from");
	let r = editor.getCursor("to");
	let pi = editor.posToOffset(i);
	let pr = editor.posToOffset(r);

	if (pi === pr) {
		const curs = editor.getCursor();
		const line = curs.line;
		const value = (sel = editor.getLine(line));
		i = { line: line, ch: 0 };
		r = { line: line, ch: value.length };
		pi = editor.posToOffset(i);
		pr = editor.posToOffset(r);
	}
	return { pi, pr, sel };
}
