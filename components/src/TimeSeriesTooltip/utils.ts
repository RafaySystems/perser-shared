// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  CursorCoordinates,
  CursorData,
  TOOLTIP_MAX_WIDTH,
  TOOLTIP_MAX_HEIGHT,
  TOOLTIP_MIN_WIDTH,
  TOOLTIP_BG_COLOR_FALLBACK,
  TOOLTIP_PADDING,
} from './tooltip-model';

export function assembleTransform(
  mousePos: CursorData['coords'],
  pinnedPos: CursorCoordinates | null,
  tooltipHeight: number,
  tooltipWidth: number,
  containerElement?: Element | null
): string | undefined {
  if (mousePos === null) return undefined;

  const cursorPaddingX = 32;
  const cursorPaddingY = 16;

  if (pinnedPos !== null) mousePos = pinnedPos;
  if (mousePos.plotCanvas.x === undefined) return undefined;

  let x = mousePos.page.x + cursorPaddingX;
  let y = mousePos.page.y + cursorPaddingY;

  if (containerElement) {
    const containerRect = containerElement.getBoundingClientRect();
    x = x - containerRect.left + containerElement.scrollLeft;
    y = y - containerRect.top + containerElement.scrollTop;
    const containerBottom = containerRect.top + containerElement.scrollHeight;
    if (y + tooltipHeight > containerBottom) {
      y = Math.max(containerBottom - tooltipHeight - cursorPaddingY, TOOLTIP_PADDING / 2);
    }
  } else {
    if (y + tooltipHeight > window.innerHeight + window.scrollY) {
      y = Math.max(window.innerHeight + window.scrollY - tooltipHeight - cursorPaddingY, TOOLTIP_PADDING / 2);
    }
  }

  if (x + tooltipWidth > window.innerWidth) x = mousePos.page.x - tooltipWidth - cursorPaddingX;
  if (x < cursorPaddingX) x = cursorPaddingX;
  if (y < TOOLTIP_PADDING / 2) y = TOOLTIP_PADDING / 2;

  return `translate3d(${x}px, ${y}px, 0)`;
}

export function getTooltipStyles(
  pinnedPos: CursorCoordinates | null,
  maxHeight?: number
): Record<string, unknown> {
  const adjustedMaxHeight = maxHeight ? maxHeight - TOOLTIP_PADDING : undefined;
  return {
    minWidth: TOOLTIP_MIN_WIDTH,
    maxWidth: TOOLTIP_MAX_WIDTH,
    maxHeight: adjustedMaxHeight ?? TOOLTIP_MAX_HEIGHT,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: TOOLTIP_BG_COLOR_FALLBACK,
    borderRadius: '6px',
    color: '#fff',
    fontSize: '11px',
    visibility: 'visible',
    opacity: 1,
    transition: 'all 0.1s ease-out',
    zIndex: pinnedPos !== null ? 'auto' : 1500,
    overflow: 'hidden',
  };
}
