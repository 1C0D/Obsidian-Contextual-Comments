import { Editor, MarkdownView } from "obsidian";
import AdvancedComments from "./main";

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
		"empty",
	];
	const hashTypes = [
		"python",
		"py",
		"ruby",
		"bash",
		"ps1",
		"zsh",
		"sh",
		"applescript",
		"yaml",
		"yml",
	];

	const lua = ["lua", "sql"];
	const html = ["html", "xml", "md"];
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
	codeBlockType: string | null,
	blockComment: boolean
) {
	let commentedSelection = "";

	if (codeBlockType) {
		const varName = commentType(codeBlockType);
		if (
			(varName === "cLikeTypes" && !blockComment) ||
			varName === "templater"
		) {
			const pattern = /^(\s*)\/\/\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				commentedSelection = selection.replace(
					/^(\s*)(.*)$/gm,
					`$1// $2`
				);
			}
		} else if (
			(blockComment && varName === "cLikeTypes") ||
			varName === "css"
		) {
			const pattern = /^\/\*\s?(.*)\s?\*\/$/gms;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gms, `/* $1 */`);
			}
		} else if (varName === "hashTypes") {
			const pattern = /^(\s*)#\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				commentedSelection = selection.replace(
					/^(\s*)(.*)$/gm,
					`$1# $2`
				);
			}
		} else if (varName === "lua") {
			const pattern = /^(\s*)--\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1$2`);
			} else {
				commentedSelection = selection.replace(
					/^(\s*)(.*)$/gm,
					`$1-- $2`
				);
			}
		} else if (varName === "bat") {
			const pattern = /^[Rr][Ee][Mm]\s?(.*)$/gm;
			if (pattern.test(selection)) {
				commentedSelection = selection.replace(pattern, `$1`);
			} else {
				commentedSelection = selection.replace(/^(.*)$/gm, `REM $1`);
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
			commentedSelection = selection.replace(/^(.*)$/gms, `%% $1 %%`);
		}
	}

	const { pi, pr } = getPosToOffset(editor, selection, blockComment);
	const from = editor.offsetToPos(pi);
	const to = editor.offsetToPos(pr);

	editor.replaceRange(commentedSelection, from, to);
}

export function getPosToOffset(
	editor: Editor,
	sel: string,
	blockComment: boolean
) {
	let i = editor.getCursor("from");
	let r = editor.getCursor("to");
	let pi = editor.posToOffset(i);
	let pr = editor.posToOffset(r);
	const value = editor.getLine(r.line);

	if (!blockComment && pi === pr) {
		i = { line: r.line, ch: 0 };
		r = { line: r.line, ch: value.length };
		pi = editor.posToOffset(i);
		pr = editor.posToOffset(r);
		sel = value;
	} else if (
		!blockComment &&
		i.line !== r.line &&
		(i.ch != 0 || r.ch != editor.getLine(r.line).length)
	) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const data = this.app.metadataCache.getFileCache(
				activeView.file
			).sections;

			if (
				data.some(
					(t: any) =>
						t.type === "code" &&
						t.position.start.line < i.line &&
						t.position.end.line > r.line
				)
			) {
				i = { line: i.line, ch: 0 };
				r = { line: r.line, ch: value.length };
				pi = editor.posToOffset(i);
				pr = editor.posToOffset(r);
				editor.setSelection(i, r);
				sel = editor.getSelection();
			}
		}
	}
	return { pi, pr, sel };
}
