export abstract class ToolBarConfig {
  abstract onSave: (() => void) | undefined;
  abstract onImport: (() => void) | undefined;
  abstract onUndo: (() => void) | undefined;
  abstract onRedo: (() => void) | undefined;
  abstract onExecute: (() => void) | undefined;
  abstract onGenerate: ((language: string) => void) | undefined;
  abstract onLanguageChange: ((language: string) => void) | undefined;
  abstract onGotoHome: (() => void) | undefined;
}
