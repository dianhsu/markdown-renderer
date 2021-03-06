#!/usr/bin/env node

import * as mume from "@shd101wyy/mume";

const program = require('commander');

/* Parse command parameters */
program
    .version(require('../package.json').version)
    .requiredOption('-i, --input <filePath>', "markdown file path")
    .option('-p, --project_path <projectDirectory>', "Project Directory", './')
program.parse(process.argv);

const options = program.opts()
let filePath = options.input;
let projectDirectoryPath = options.project_path;

/* Ensure parameters are correct */
if (!options.input || !options.input.endsWith(".md")) {
    console.error("File to convert must be a .md file");
    process.exit(1);
}

/* Convert md to html */
async function main() {
    console.info("File to convert: " + filePath);

    await mume.init();

    const engine = new mume.MarkdownEngine({
        filePath: filePath,
        projectDirectoryPath: projectDirectoryPath,
        config: {
            previewTheme: "github-light.css",
            enableLinkify: true,
            mathRenderingOption: "KaTeX",  // "KaTeX" | "MathJax" | "None"
            mathInlineDelimiters: [["$", "$"], ["\\(", "\\)"]],
            mathBlockDelimiters: [["$$", "$$"], ["\\[", "\\]"]],
            mathRenderingOnLineService: "https://latex.codecogs.com/gif.latex",
            enableWikiLinkSyntax: true,
            useGitHubStylePipedLink: true,
            // By default, the extension for wikilink is `.md`. For example: [[test]] will direct to file path `test.md`.
            wikiLinkFileExtension: '.md',

            // Enable emoji & font-awesome plugin. This only works for markdown-it parser, but not pandoc parser.
            enableEmojiSyntax: true,

            // Enable extended table syntax to support merging table cells.
            enableExtendedTableSyntax: true,
            frontMatterRenderingOption: 'none',
            mermaidTheme: 'mermaid.css',
            codeBlockTheme: "default.css",
            revealjsTheme: "white.css",
            protocolsWhiteList: "http://, https://, atom://, file://, mailto:, tel:",
            HTML5EmbedUseImageSyntax: true,
            HTML5EmbedUseLinkSyntax: false,

            // When true embed media with http:// schema in URLs. When false ignore and don't embed them.
            HTML5EmbedIsAllowedHttp: false,

            // HTML attributes to pass to audio tags.
            HTML5EmbedAudioAttributes: 'controls preload="metadata" width="320"',

            // HTML attributes to pass to video tags.
            HTML5EmbedVideoAttributes: 'controls preload="metadata" width="320" height="240"',
        }
    });

    await engine.htmlExport({offline: false, runAllCodeChunks: false});

    return process.exit();
}

main(filePath, projectDirectoryPath).catch(function (reason) {
    console.error(reason);
    process.exit(1);
});