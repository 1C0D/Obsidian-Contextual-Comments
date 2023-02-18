
import { Editor, Plugin } from "obsidian";
import { commentSelection } from "./CommentHelper";

export default class CodeBlocksComments extends Plugin {
	async onload() {
		this.addCommand({
			id: "better-comments",
			name: "Code Blocks Comments",
			editorCallback: (editor) => this.codeBlocksComments(editor),
		});
	}

	codeBlocksComments = (editor: Editor): void => {
		const { selection, value } = this.getSelectionAndValue(editor);

		if (!selection) {
			return;
		}

		const { line: anchor, ch: anchorChar } = editor.getCursor("from");
		const { line: head, ch: headChar } = editor.getCursor("to");

		const codeBlockType = this.getCodeBlockType(editor, value, selection);
		const { commentedSelection, useSelection } = commentSelection({
			selection,
			codeBlockType,
		});

		editor.replaceSelection(commentedSelection);
		const offset = commentedSelection.length - selection.length;
		const lastLine = Math.max(head, anchor);
		const firstLine = Math.min(head, anchor);
		const firstLineChar = firstLine === anchor ? anchorChar : headChar;
		const lastLineChar = lastLine === head ? headChar : anchorChar;
		// console.log(
		// 	`firstLine: ${firstLine}, 
		// 	lastLine: ${lastLine}, 
		// 	firstLineChar: ${firstLineChar}, 
		// 	lastLineChar: ${lastLineChar}`
		);
		if (useSelection)
			editor.setSelection(
				{ line: firstLine, ch: firstLineChar },
				{ line: lastLine, ch: lastLineChar + offset / 2 } //bout de ligne?
			);
	};

	getSelectionAndValue = (editor: Editor) => {
		const selection = editor.getSelection();
		const value = editor.getValue();
		return { selection, value };
	};

	getCodeBlockType = (
		editor: Editor,
		value: string,
		selection: string
	): string | null => {
		const codeBlockRegex = /^```([a-z0-9-+]+)\n([\s\S]*?)\n```$/gm;
		let codeBlockMatch;
		const startOffset = editor.posToOffset(editor.getCursor("from"));
		const endOffset = editor.posToOffset(editor.getCursor("to"));
		const cursorIndex = Math.min(startOffset, endOffset);

		while ((codeBlockMatch = codeBlockRegex.exec(value))) {
			if (
				codeBlockMatch.index <= cursorIndex &&
				codeBlockMatch.index + codeBlockMatch[0].length >=
					cursorIndex + selection.length
			) {
				return codeBlockMatch[1];
			}
		}
		return null;
	};
}
