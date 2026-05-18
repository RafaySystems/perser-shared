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
import { Skeleton } from '../ui/skeleton';

interface TextOverlayProps {
  message: string;
}

export function TextOverlay({ message }: TextOverlayProps): ReactElement {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface NoDataOverlayProps {
  resource: string;
}

export function NoDataOverlay({ resource }: NoDataOverlayProps): ReactElement {
  return <TextOverlay message={`No ${resource}`} />;
}

export function LoadingOverlay(): ReactElement {
  return (
    <div className="flex h-full items-center justify-center px-1">
      <Skeleton className="h-[30%] w-full rounded-md" aria-label="Loading..." />
    </div>
  );
}
