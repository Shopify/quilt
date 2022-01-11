import Key, {HeldKey, ModifierKey} from '../keys';
import {DefaultIgnoredTag} from '../Shortcut';

const ON_MATCH_DELAY = 500;

export interface Data {
  node: HTMLElement | null | undefined;
  ordered: Key[];
  held?: HeldKey;
  ignoreInput: boolean;
  ignoredTags: DefaultIgnoredTag[];
  allowDefault: boolean;
  onMatch(matched: {ordered: Key[]; held?: HeldKey}): void;
}

export default class ShortcutManager {
  private keysPressed: Key[] = [];
  private shortcuts: Data[] = [];
  private shortcutsMatched: Data[] = [];
  private timer!: number;

  setup() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  subscribe(data: Data) {
    const {shortcuts} = this;

    shortcuts.push(data);

    return {
      unsubscribe() {
        const unsubscribeIndex = shortcuts.findIndex(
          (shortcut) => shortcut === data,
        );
        shortcuts.splice(unsubscribeIndex, 1);
      },
    };
  }

  private resetKeys() {
    this.keysPressed = [];
    this.shortcutsMatched = [];
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const {key} = event;

    this.keysPressed.push(key as Key);
    this.updateMatchingShortcuts(event);

    switch (this.shortcutsMatched.length) {
      case 0:
        this.resetKeys();
        break;
      case 1:
        this.callMatchedShortcut(event);
        break;
      default:
        this.timer = window.setTimeout(() => {
          this.callMatchedShortcut(event);
        }, ON_MATCH_DELAY);
    }
  };

  private allModifiersAreHeld(heldKeys: HeldKey, event: KeyboardEvent) {
    function hasKeyGroups(groups: HeldKey): groups is HeldKey {
      return groups.every((key) => Array.isArray(key));
    }

    function keyGroupIsHeld(keyGroup: ModifierKey[]) {
      return keyGroup.every(
        (key: ModifierKey) =>
          event.getModifierState && event.getModifierState(key),
      );
    }

    return hasKeyGroups(heldKeys)
      ? heldKeys.some(keyGroupIsHeld)
      : keyGroupIsHeld(heldKeys);
  }

  private updateMatchingShortcuts(event: KeyboardEvent) {
    const shortcuts =
      this.shortcutsMatched.length > 0 ? this.shortcutsMatched : this.shortcuts;

    this.shortcutsMatched = shortcuts.filter(
      ({ordered, held, node, ignoreInput, ignoredTags}) => {
        if (isFocusedInput(ignoredTags) && !ignoreInput) {
          return false;
        }

        if (held && !this.allModifiersAreHeld(held, event)) {
          return false;
        }

        const partiallyMatching = arraysMatch(
          this.keysPressed,
          ordered.slice(0, this.keysPressed.length),
        );

        if (node) {
          const onFocusedNode = document.activeElement === node;
          return partiallyMatching && onFocusedNode;
        }

        return partiallyMatching;
      },
    );
  }

  private callMatchedShortcut(event: Event) {
    const longestMatchingShortcut = this.shortcutsMatched.find(({ordered}) =>
      arraysMatch(ordered, this.keysPressed),
    );

    if (!longestMatchingShortcut) {
      return;
    }

    if (!longestMatchingShortcut.allowDefault) {
      event.preventDefault();
    }

    longestMatchingShortcut.onMatch({
      ordered: longestMatchingShortcut.ordered,
      held: longestMatchingShortcut.held,
    });

    clearTimeout(this.timer);

    this.resetKeys();
  }
}

function isFocusedInput(ignoredTags: string[]) {
  const target = document.activeElement;

  if (target == null || target.tagName == null) {
    return false;
  }

  return (
    ignoredTags.includes(target.tagName) ||
    target.hasAttribute('contenteditable')
  );
}

function arraysMatch<T>(first: T[], second: T[]) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((value, index) => second[index] === value);
}
