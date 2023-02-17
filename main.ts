import { Editor, EditorSelectionOrCaret, Plugin } from "obsidian";

export default class BetterComments extends Plugin {
	async onload() {
		this.addCommand({
			id: "better-comments",
			name: "Better Comments",
			editorCallback: (editor) => this.betterComments(editor),
		});
	}

	betterComments = (editor: Editor): void => {
		const selection = editor.getSelection();
		const value = editor.getValue();
		console.log("value", value);

		// Check if the selected text is in a code block and detect its type
		let codeBlockType = null;
		//   const codeBlockRegex = /^```(js|javascript|python|jsx|ts|json|htmlmixed|xml|markdown|css|less|scss|sql|sh|console|cpp|clike|cs|java|go|ruby|lua|rust)\s([\s\S]*?)\n```$/gm;
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
				codeBlockType = codeBlockMatch[1];
				break;
			}
		}

		// // Add comments to the selected text
		let commentedSelection = "";

		// Define supported code block types

		const cLikeTypes = [
			"c",
			"cpp",
			"c++",
			"clike",
			"cs",
			"java",
			"js",
			"javascript",
			"ts",
			"typescript",
			"jsx",
			"less",
			"scss",
			"",
		];
		const hashTypes = ["python", "ruby"];
		const slashTypes = ["go", "javascript", "jsx", "typescript"];
		const css = ["css"]; /**/

		if (codeBlockType && cLikeTypes.includes(codeBlockType.toLowerCase())) {
			commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
		} else if (
			codeBlockType &&
			hashTypes.includes(codeBlockType.toLowerCase())
		) {
			commentedSelection = selection.replace(/^(.*)$/gm, `# $1`);
		} else if (
			codeBlockType &&
			slashTypes.includes(codeBlockType.toLowerCase())
		) {
			commentedSelection = selection.replace(/^(.*)$/gm, `// $1`);
		} else if (codeBlockType && css.includes(codeBlockType.toLowerCase())) {
			commentedSelection = selection.replace(/^(.*)$/gm, `/* $1 */`);
		} else {
			commentedSelection = selection.replace(/^(.*)$/gm, `%% $1 %%`);
		}

		// Replace the selected text with the commented text
		editor.replaceSelection(commentedSelection);
	};
}
