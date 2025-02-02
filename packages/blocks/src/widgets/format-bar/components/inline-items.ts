import { html, nothing } from 'lit';

import type { AffineTextAttributes } from '../../../__internal__/rich-text/virgo/types.js';
import {
  inlineFormatConfig,
  noneInlineUnsupportedBlockSelected,
} from '../../../page-block/const/inline-format-config.js';
import { isPageComponent } from '../../../page-block/utils/guard.js';
import {
  getBlockSelections,
  getCombinedFormatInBlockSelections,
  getCombinedFormatInTextSelection,
  getTextSelection,
} from '../../../page-block/utils/selection.js';
import type { AffineFormatBarWidget } from '../format-bar.js';
import { BackgroundButton } from './background/background-button.js';

export const InlineItems = (formatBar: AffineFormatBarWidget) => {
  const pageElement = formatBar.pageElement;
  if (!isPageComponent(pageElement)) {
    throw new Error('the pageElement of formatBar is not a PageComponent');
  }

  if (!noneInlineUnsupportedBlockSelected(pageElement)) {
    return nothing;
  }

  let type: 'text' | 'block' = 'text';
  let format: AffineTextAttributes = {};
  const textSelection = getTextSelection(pageElement);
  const blockSelections = getBlockSelections(pageElement);

  if (
    !(
      (textSelection && !textSelection.isCollapsed()) ||
      blockSelections.length > 0
    )
  ) {
    return [];
  }

  if (textSelection) {
    format = getCombinedFormatInTextSelection(pageElement, textSelection);
    type = 'text';
  } else {
    format = getCombinedFormatInBlockSelections(pageElement, blockSelections);
    type = 'block';
  }

  const backgroundButton = BackgroundButton(formatBar);

  return html`${inlineFormatConfig
      .filter(({ showWhen }) => showWhen(pageElement))
      .map(
        ({ id, name, icon, action, activeWhen }) => html`<icon-button
          size="32px"
          class="has-tool-tip"
          data-testid=${id}
          ?active=${activeWhen(format)}
          @click=${() => {
            action({
              pageElement,
              type,
              format,
            });
            formatBar.requestUpdate();
          }}
        >
          ${icon}
          <tool-tip inert role="tooltip">${name}</tool-tip>
        </icon-button>`
      )}
    <div class="divider"></div>
    ${backgroundButton}
    <div class="divider"></div>`;
};
