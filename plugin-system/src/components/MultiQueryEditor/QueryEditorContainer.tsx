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

import { produce } from 'immer';
import { QueryDefinition, QueryPluginType } from '@perses-dev/spec';
import { Trash2 as DeleteIcon, ChevronDown, ChevronRight, AlertTriangle as AlertIcon } from 'lucide-react';
import { forwardRef, HTMLAttributes, ReactElement } from 'react';
import { Button, Spinner, InfoTooltip } from '@perses-dev/components';
import { QueryData } from '../../runtime';
import { PluginEditor, PluginEditorProps, PluginEditorRef } from '../PluginEditor';

/**
 * Properties for {@link QueryEditorContainer}
 */
interface QueryEditorContainerProps {
  queryTypes: QueryPluginType[];
  index: number;
  query: QueryDefinition;
  queryResult?: QueryData;
  filteredQueryPlugins?: string[];
  onChange: (index: number, query: QueryDefinition) => void;
  onQueryRun: (index: number, query: QueryDefinition) => void;
  onCollapseExpand: (index: number) => void;
  isCollapsed?: boolean;
  onDelete?: (index: number) => void;
}

/**
 * Container for a query editor. This component is responsible for rendering the query editor, and make it collapsible
 * to not take too much space.
 * @param queryTypes the supported query types
 * @param index the index of the query in the list
 * @param query the query definition
 * @param isCollapsed whether the query editor is collapsed or not
 * @param onDelete callback when the query is deleted
 * @param onChange callback when the query is changed
 * @param onCollapseExpand callback when the query is collapsed or expanded
 * @constructor
 */

export const QueryEditorContainer = forwardRef<PluginEditorRef, QueryEditorContainerProps>(
  (props, ref): ReactElement => {
    const {
      queryTypes,
      index,
      query,
      queryResult,
      filteredQueryPlugins,
      isCollapsed,
      onDelete,
      onChange,
      onQueryRun,
      onCollapseExpand,
    } = props;
    return (
      <div key={index} className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-between border-b border-border">
          <div className="flex flex-row">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCollapseExpand(index)}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <span className="text-xs font-medium uppercase tracking-wide leading-none self-center">
              Query #{index + 1}
            </span>
          </div>
          <div className="flex flex-row items-center">
            {queryResult?.isFetching && <Spinner className="h-4 w-4" aria-label="loading" />}
            {queryResult?.error && (
              <InfoTooltip description={queryResult.error.message}>
                <div className="flex flex-row items-center text-destructive">
                  <Button variant="ghost" size="icon" aria-label="query error" className="h-6 w-6 text-destructive">
                    <AlertIcon className="h-4 w-4" />
                  </Button>
                  <span
                    className="max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis text-sm"
                  >
                    {queryResult.error.message}
                  </span>
                </div>
              </InfoTooltip>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="delete query"
                className="h-6 w-6"
                onClick={() => onDelete && onDelete(index)}
              >
                <DeleteIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {!isCollapsed && (
          <QueryEditor
            ref={ref}
            queryTypes={queryTypes}
            value={query}
            filteredQueryPlugins={filteredQueryPlugins}
            onChange={(next) => onChange(index, next)}
            onQueryRun={() => onQueryRun(index, query)}
          />
        )}
      </div>
    );
  }
);

QueryEditorContainer.displayName = 'QueryEditorContainer';

// Props on div that we don't want people to pass because we're either redefining them or providing them in
// this component
type OmittedProps = 'children' | 'value' | 'onChange';
interface QueryEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, OmittedProps> {
  queryTypes: QueryPluginType[];
  value: QueryDefinition;
  filteredQueryPlugins?: string[];
  onChange: (next: QueryDefinition) => void;
  onQueryRun: () => void;
}

/**
 * Editor for a query definition. This component is responsible for rendering the plugin editor for the given query.
 * This will allow user to select a plugin extending from the given supported query types, and then edit the plugin
 * spec for this plugin.
 * @param props
 * @constructor
 */

const QueryEditor = forwardRef<PluginEditorRef, QueryEditorProps>((props, ref): ReactElement => {
  const { queryTypes, value, filteredQueryPlugins, onChange, onQueryRun, ...others } = props;

  const handlePluginChange: PluginEditorProps['onChange'] = (next) => {
    onChange(
      produce(value, (draft) => {
        draft.kind = next.selection.type;
        draft.spec.plugin.kind = next.selection.kind;
        draft.spec.plugin.spec = next.spec;
      })
    );
  };

  return (
    <div {...others}>
      <PluginEditor
        ref={ref}
        pluginTypes={queryTypes}
        pluginKindLabel="Query Type"
        value={{
          selection: {
            kind: value.spec.plugin.kind,
            type: value.kind,
          },
          spec: value.spec.plugin.spec,
        }}
        filteredQueryPlugins={filteredQueryPlugins}
        withRunQueryButton
        onRunQuery={onQueryRun}
        onChange={handlePluginChange}
      />
    </div>
  );
});

QueryEditor.displayName = 'QueryEditor';
