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

export type PaletteMode = 'light' | 'dark';

export interface PersesTheme {
  mode: PaletteMode;
}

/**
 * Returns a minimal theme descriptor. All actual colours are resolved through
 * CSS custom-properties defined in globals.css — call this only when you need
 * the current mode string (e.g. for third-party libraries like ECharts).
 */
export function getTheme(mode: PaletteMode): PersesTheme {
  return { mode };
}
