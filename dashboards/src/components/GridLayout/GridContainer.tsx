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

import { cn } from '@perses-dev/components';
import { CSSProperties, ReactElement, ReactNode, useEffect, useState } from 'react';

export interface GridContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function GridContainer(props: GridContainerProps): ReactElement {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  return (
    <section
      className={cn('grid-container', props.className)}
      style={props.style}
      data-testid="panel-group"
      data-first-render={isFirstRender ? 'true' : undefined}
    >
      {props.children}
      <style>{`
        .grid-container + .grid-container {
          margin-top: 4px;
        }
        .grid-container[data-first-render="true"] .react-grid-item.cssTransforms {
          transition-property: none;
        }
        .grid-container .react-grid-layout {
          position: relative;
          transition: height 200ms ease;
        }
        .grid-container .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .grid-container .react-grid-item img {
          pointer-events: none;
          user-select: none;
        }
        .grid-container .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        .grid-container .react-grid-item.resizing {
          z-index: 1;
          will-change: width, height;
        }
        .grid-container .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
          will-change: transform;
        }
        .grid-container .react-grid-item.dropping {
          visibility: hidden;
        }
        .grid-container .react-grid-item.react-grid-placeholder {
          background: var(--primary);
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
        }
        .grid-container .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .grid-container .react-grid-item > .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid hsl(var(--muted-foreground));
          border-bottom: 2px solid hsl(var(--muted-foreground));
        }
        .grid-container .react-resizable-hide > .react-resizable-handle {
          display: none;
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-sw {
          bottom: 0; left: 0; cursor: sw-resize; transform: rotate(90deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-se {
          bottom: 0; right: 0; cursor: se-resize;
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-nw {
          top: 0; left: 0; cursor: nw-resize; transform: rotate(180deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-ne {
          top: 0; right: 0; cursor: ne-resize; transform: rotate(270deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w,
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
          top: 50%; margin-top: -10px; cursor: ew-resize;
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w {
          left: 0; transform: rotate(135deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
          right: 0; transform: rotate(315deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n,
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
          left: 50%; margin-left: -10px; cursor: ns-resize;
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n {
          top: 0; transform: rotate(225deg);
        }
        .grid-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
          bottom: 0; transform: rotate(45deg);
        }
        .grid-container .react-resizable {
          position: relative;
        }
        .grid-container .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
          background-position: bottom right;
          padding: 0 3px 3px 0;
        }
        .grid-container .react-resizable-handle-sw { bottom: 0; left: 0; cursor: sw-resize; transform: rotate(90deg); }
        .grid-container .react-resizable-handle-se { bottom: 0; right: 0; cursor: se-resize; }
        .grid-container .react-resizable-handle-nw { top: 0; left: 0; cursor: nw-resize; transform: rotate(180deg); }
        .grid-container .react-resizable-handle-ne { top: 0; right: 0; cursor: ne-resize; transform: rotate(270deg); }
        .grid-container .react-resizable-handle-w,
        .grid-container .react-resizable-handle-e { top: 50%; margin-top: -10px; cursor: ew-resize; }
        .grid-container .react-resizable-handle-w { left: 0; transform: rotate(135deg); }
        .grid-container .react-resizable-handle-e { right: 0; transform: rotate(315deg); }
        .grid-container .react-resizable-handle-n,
        .grid-container .react-resizable-handle-s { left: 50%; margin-left: -10px; cursor: ns-resize; }
        .grid-container .react-resizable-handle-n { top: 0; transform: rotate(225deg); }
        .grid-container .react-resizable-handle-s { bottom: 0; transform: rotate(45deg); }
      `}</style>
    </section>
  );
}
