# Expiring Blocks

Collapsible scratch areas inside a note. Each block has a lifetime in days: editing its contents renews it, and once it expires its contents are cleared automatically.

## Usage

- Command **Create expiring block**, or the editor context menu.
- Set the default lifetime under Settings → Expiring Blocks → **Lifetime (days)**.
- The block is stored as plain Markdown comments (`%% nsb-toggle {...} %%` … `%% /nsb-toggle %%` with expiry metadata), so the note stays readable without the plugin.

## With or without Editor Enhancer

Expiring Blocks ships its own copy of the toggle engine, so it works on its own. When [Editor Enhancer](https://github.com/Paipa03/obsidian-editor-enhancer) is installed, that plugin takes over the shared engine and expiring blocks can be dragged like any other block.

## Install

Settings → Community plugins → Browse → search **Expiring Blocks**.

Manual: download `main.js`, `manifest.json` and `styles.css` from the latest release into `<vault>/.obsidian/plugins/expiring-blocks/`.

## Notes

- Some settings labels are currently in Chinese.
- Expired contents are deleted from the note. Keep anything you need outside expiring blocks.

## License

MIT
