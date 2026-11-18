# JAC Works 0.1.7: Configurable keyboard controls

**Scope:** Browser client controls and Options UI. Compatible extension of 0.1.6; no boss, gear, talent, network message or cloud-account changes.

## Feature

Open **Options → Keybindings**, click any action's displayed key, then press a new key. You will see the new key immediately in the control list and, for abilities, on the game HUD. Escape cancels capture without changing an assignment; when not capturing, Escape closes Options even if a settings field has focus.

| Action | Default |
|---|---|
| Move forward / backward | W / S |
| Strafe left / right | A / D |
| Interact with trainer, Crafter, Wardrobe, tree or boss pedestal | E |
| Use ability slots 1, 2, 3, 4 | 1, 2, 3, 4 |
| Propose or retry boss | R |
| Return to hub | H |
| Open chat | Enter |

A shortcut cannot be used by two actions at once; the editor explains conflicts and keeps capture mode open so the player can choose another key. Escape, Tab, modifiers, browser function keys and unsafe browser-navigation keys are reserved. Arrow keys, Space, numbers, punctuation and normal unmodified letters are supported. Shift remains an available self-target modifier, including with digit skill bindings.

**Restore default keybindings** returns every action to the table above. Changes save immediately to `localStorage` under `jacworks-keybindings-v1`; it is independent of class, inventory, talents and camera settings. Invalid/corrupt saves fall back to defaults, and updates made in another tab synchronize into open tabs.

## Integration details

- Isolated `shared/keybindings.ts` model and `client/src/keybindingEditor.ts` panel avoid coupling initial game rendering to settings logic.
- Both lobby dummy practice and encounter ability hotkeys use the bound 1–4 slot keys. Main-world interaction and room/encounter navigation respect bound actions.
- HUD keycaps, movement instructions, hub interaction hints and chat hint update live after rebinding.
- Chat open is blocked when Options, the trainer, inventory, the talent tree, boss voting or Game Dev Labs are active; text inputs and editable elements never trigger movement or abilities. Actual chat messages still send with Enter and cancel with Escape.
- Returning from Options focuses the playable canvas so keyboard shortcuts work immediately.
- The authoritative game continues to validate `input` and `ability` actions as before; raw keybindings never leave the browser. The historical PR #15 implementation is a source reference only and is not reinstated.

## Verification

Run:

```bash
npm run build
npm test
npm run smoke
npx playwright test tests/release-017-keybindings.spec.ts tests/release-016-talents-gear.spec.ts tests/release-015-lobby-talents.spec.ts
```

The new unit tests cover saved layouts, malformed preferences, conflicts, reserved keys, swapping bindings, key display and Shift-digit targeting. Browser regression covers Options, conflict feedback, arrow keys, saving/reloading, changed chat input, changed ability slot cooldowns, Escape cancellation, and restoring defaults.

**Publication rule:** Publish via a dedicated PR and merge only after all GitHub Actions checks succeed. `main` may trigger production Workers Builds; confirm deployed client/server versions independently.
