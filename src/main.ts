import { Editor, MarkdownView, Plugin } from "obsidian";
import { commentSelection, getPosToOffset } from "./CommentHelper";

export default class AdvancedComments extends Plugin {
	async onload() {
		this.addCommand({
			id: "advanced-comments",
			name: "Advanced Comments",
			editorCallback: (editor) => this.advancedComments(editor),
		});

		this.addCommand({
			id: "trim-end-all-doc",
			name: "Trim End All Doc",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const value = editor.getValue().replace(/[ \t]+$/gm, "");
				editor.setValue(value);
			},
		});

		this.addCommand({
			id: "trim-end-code-blocks",
			name: "Trim End Code Blocks",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const value = editor
					.getValue()
					.replace(
						/^```([a-z0-9-+]+)\n([\s\S]*?)\n```$/gim,
						(match, p1, p2) => {
							return (
								"```" +
								p1 +
								"\n" +
								p2.replace(/[ \t]+$/gm, "") +
								"\n```"
							);
						}
					);
				editor.setValue(value);
			},
		});
	}

	advancedComments = (editor: Editor): void => {
		// eslint-disable-next-line prefer-const
		let { selection, value } = this.getSelectionAndValue(editor);

		if (!selection) {
			const curs = editor.getCursor();
			const line = curs.line;
			selection = editor.getLine(line);
			if (selection.trim() === "") return;
		}

		const { pi, pr, sel } = getPosToOffset(editor, selection);
		const codeBlockType = this.getBlockType(editor, value, sel, pi, pr);
		commentSelection(editor, sel, codeBlockType);
	};

	getSelectionAndValue = (editor: Editor) => {
		const selection = editor.getSelection();
		const value = editor.getValue();
		return { selection, value };
	};

	getBlockType = (
		editor: Editor,
		value: string,
		sel: string,
		pi: number,
		pr: number
	): string | null => {
		const codeBlockRegex = /^```([a-z0-9-+]*)\n([\s\S]*?)\n```$/gim; //case-insensitive
		const templateBlockRegex = /^<%\*(.*?)%>$/gms;
		const cursorIndex = Math.min(pi, pr);
		let blockMatch;

		while ((blockMatch = codeBlockRegex.exec(value))) {
			// find in what block selection is
			if (
				blockMatch.index <= cursorIndex &&
				blockMatch.index + blockMatch[0].length >=
					cursorIndex + sel.length
			) {
				return blockMatch[1] ? blockMatch[1] : "empty"
			}
		}
		while ((blockMatch = templateBlockRegex.exec(value))) {
			// find in what block selection is
			if (
				blockMatch.index <= cursorIndex &&
				blockMatch.index + blockMatch[0].length >=
					cursorIndex + sel.length
			) {
				return "templater";
			}
		}
		return null;
	};
}
