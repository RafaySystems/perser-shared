import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Badge,
} from '@perses-dev/components';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Command (Combobox)',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const datasources = [
  { value: 'prometheus-prod', label: 'prometheus-prod', type: 'Prometheus' },
  { value: 'prometheus-staging', label: 'prometheus-staging', type: 'Prometheus' },
  { value: 'loki-prod', label: 'loki-prod', type: 'Loki' },
  { value: 'loki-dev', label: 'loki-dev', type: 'Loki' },
  { value: 'tempo-prod', label: 'tempo-prod', type: 'Tempo' },
];

export const DatasourceCombobox: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('prometheus-prod');
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-64 justify-between">
            {value ? datasources.find((d) => d.value === value)?.label : 'Select datasource...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search datasources..." />
            <CommandList>
              <CommandEmpty>No datasource found.</CommandEmpty>
              <CommandGroup label="Prometheus">
                {datasources
                  .filter((d) => d.type === 'Prometheus')
                  .map((d) => (
                    <CommandItem
                      key={d.value}
                      value={d.value}
                      onSelect={(current) => { setValue(current); setOpen(false); }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === d.value ? 'opacity-100' : 'opacity-0')} />
                      {d.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup label="Loki">
                {datasources
                  .filter((d) => d.type === 'Loki')
                  .map((d) => (
                    <CommandItem
                      key={d.value}
                      value={d.value}
                      onSelect={(current) => { setValue(current); setOpen(false); }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === d.value ? 'opacity-100' : 'opacity-0')} />
                      {d.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
};

export const InlineSearch: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Search panels..." />
      <CommandList>
        <CommandEmpty>No panel found.</CommandEmpty>
        <CommandGroup heading="Panels">
          {[
            { name: 'CPU Usage', type: 'gauge' },
            { name: 'Memory Usage', type: 'gauge' },
            { name: 'HTTP Requests', type: 'timeseries' },
            { name: 'Error Rate', type: 'timeseries' },
            { name: 'Latency P99', type: 'stat' },
          ].map((p) => (
            <CommandItem key={p.name} className="flex items-center justify-between">
              {p.name}
              <Badge variant="secondary" className="text-xs">{p.type}</Badge>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
