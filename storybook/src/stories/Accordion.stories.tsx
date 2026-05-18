import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Switch,
  Label,
  Badge,
} from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Accordion',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const VariableList: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96">
      <AccordionItem value="builtin">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Built-in Variables
            <Badge variant="secondary" className="text-xs">3</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {['__interval', '__rate_interval', '__range'].map((v) => (
            <div key={v} className="flex items-center justify-between px-2 py-1 rounded bg-muted/40">
              <code className="text-sm font-mono">{v}</code>
              <Badge variant="outline" className="text-xs">auto</Badge>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="custom">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Custom Variables
            <Badge variant="secondary" className="text-xs">2</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {[
            { name: 'env', type: 'list', value: 'prod' },
            { name: 'instance', type: 'query', value: 'web-01' },
          ].map((v) => (
            <div key={v.name} className="flex items-center justify-between px-2 py-1 rounded bg-muted/40">
              <code className="text-sm font-mono">${v.name}</code>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{v.type}</Badge>
                <span className="text-xs text-muted-foreground">{v.value}</span>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const PanelOptions: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['legend']} className="w-80">
      <AccordionItem value="legend">
        <AccordionTrigger>Legend</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show Legend</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Values</Label>
            <Switch />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tooltip">
        <AccordionTrigger>Tooltip</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show All Series</Label>
            <Switch defaultChecked />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="thresholds">
        <AccordionTrigger>Thresholds</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">No thresholds configured.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
