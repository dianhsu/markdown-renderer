#!/usr/bin/env node

import * as mume from "@shd101wyy/mume";
import * as fse from 'fs-extra';

const program = require('commander');
let filePath;
let projectDirectoryPath;

/* Parse command parameters */
program
    .version(require('../package.json').version)
    .arguments('<input> <projectDirectory>')
    .action(function (input, projectDirectory) {
        filePath = input;
        projectDirectoryPath = projectDirectory;
    });
program.parse(process.argv);

/* Show help if no parameters are passed */
if ((typeof filePath == 'undefined') ||
    (typeof projectDirectoryPath == 'undefined')) {
    program.help();
}

/* Ensure parameters are correct */
if (!filePath.endsWith(".md")) {
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