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

import { ReactElement } from 'react';

export function DropIndicator(): ReactElement {
  return (
    <div className="flex flex-row items-center">
      <div className="absolute w-2 h-2 box-border bg-background border-2 border-info rounded-full" />
      <div className="h-0.5 bg-info w-full" />
    </div>
  );
}
