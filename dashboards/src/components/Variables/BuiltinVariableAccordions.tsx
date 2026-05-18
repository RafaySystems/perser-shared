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

import { BuiltinVariableDefinition } from '@perses-dev/spec';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@perses-dev/components';
import { InfoTooltip } from '@perses-dev/components';
import { ReactElement, useMemo } from 'react';

type BuiltinVariableAccordionsProps = {
  builtinVariableDefinitions: BuiltinVariableDefinition[];
};

export function BuiltinVariableAccordions({
  builtinVariableDefinitions,
}: BuiltinVariableAccordionsProps): ReactElement {
  const builtinVariablesBySource = useMemo(() => {
    const result: Record<string, BuiltinVariableDefinition[]> = {};
    for (const definition of builtinVariableDefinitions) {
      const value = result[definition.spec.source];
      if (value) {
        value.push(definition);
        continue;
      }
      result[definition.spec.source] = [definition];
    }
    return result;
  }, [builtinVariableDefinitions]);

  const sources = useMemo(() => {
    const result: string[] = [];
    for (const source in builtinVariablesBySource) {
      if (!result.includes(source)) {
        result.push(source);
      }
    }
    return result;
  }, [builtinVariablesBySource]);

  return (
    <Accordion type="multiple" className="w-full">
      {sources.map((source) => (
        <AccordionItem key={source} value={source}>
          <AccordionTrigger className="bg-muted/50 px-4">
            <h2 className="text-base font-semibold">
              <InfoTooltip
                title={`${source} Built-in Variables`}
                description="Variables computed during dashboard rendering."
              >
                <span>{source} Built-in Variables</span>
              </InfoTooltip>
            </h2>
          </AccordionTrigger>
          <AccordionContent className="bg-muted/50 px-4">
            <Table aria-label="table of external variables" className="min-w-[650px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(builtinVariablesBySource[source] ?? []).map((v) => (
                  <TableRow key={source + '-' + v.spec.name}>
                    <TableCell className="font-bold">{v.spec.name}</TableCell>
                    <TableCell>{v.spec.display?.description ?? ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
