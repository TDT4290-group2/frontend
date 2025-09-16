# VSCode tips

## Improve your workflow

### VSCode Profiles

Separate your settings and extensions based on the projects
you're working on or your different responsibilities with [VSCode Profiles](https://code.visualstudio.com/docs/editor/profiles)

### VSCode Extensions

Maintain consistent coding styles in teams [`EditorConfig.EditorConfig`](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

Make TypeScript errors readable with [`YoavBls.pretty-ts-errors`](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

#### Intellisense (Autocomplete)

- Module imports: [`christian-kohler.npm-intellisense`](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- Tailwind classes: [`bradlc.vscode-tailwindcss`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Read more about [Intellisense](https://code.visualstudio.com/docs/editor/intellisense)

#### Run unit tests in VSCode

[`vitest.explorer`](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)

#### Run and record e2e tests in VSCode

[`ms-playwright.playwright`](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

#### Format files automatically

Install the official Biome extension [`biomejs.biome`](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

Configure the VSCode workspace settings:

```jsonc
// .vscode/settings.json
{
  // Set default formatter to Biome
  "editor.defaultFormatter": "biomejs.biome",
  // Format on save
  "editor.formatOnSave": true,
  // On save:
  "editor.codeActionsOnSave": {
    // add missing imports
    "source.addMissingImports.ts": "always",
    // organise imports
    "source.organizeImports": "always"
  },
}
```

### Write HTML blazingly fast with Emmet

Emmet provides snippets and abbreviations to write HTML tags quickly.
Emmet is included by default with VSCode, so you don't need an extension!

Read about [Emmet in VSCode](https://code.visualstudio.com/docs/editor/emmet)

### Improve your Git experience with Source Control

Source Control in VSCode provides a visual UI for interacting with Git.
Personally, this vastly improves the experience learning Git.
Once you've learned Git commands through Source Control,
then you can decide whether to memorise the commands for the terminal.

Read more about [VSCode Source Control](https://code.visualstudio.com/docs/sourcecontrol/overview)