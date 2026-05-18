import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Input,
  Label,
  Separator,
} from '@perses-dev/components';

const meta: Meta = {
  title: 'Components/Dialog (Sheet)',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

function SheetDemo({ side = 'right' as 'right' | 'left' | 'top' | 'bottom', title = 'Edit Panel' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open {title}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>Make changes to your panel settings here.</SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="flex-1 overflow-auto py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="panel-name">Panel Name</Label>
              <Input id="panel-name" defaultValue="CPU Usage" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-desc">Description</Label>
              <Input id="panel-desc" placeholder="Optional description..." />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export const RightDrawer: Story = {
  render: () => <SheetDemo side="right" title="Edit Panel" />,
};

export const LeftDrawer: Story = {
  render: () => <SheetDemo side="left" title="Navigation" />,
};

export const BottomSheet: Story = {
  render: () => <SheetDemo side="bottom" title="Filter Options" />,
};

export const WideDrawer: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Panel Editor</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="flex flex-col w-full sm:max-w-[1080px]">
            <SheetHeader>
              <SheetTitle>Panel Editor</SheetTitle>
              <SheetDescription>Full-width panel editor with preview</SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-auto py-4">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Configuration</h3>
                <div className="space-y-2">
                  <Label>Panel Name</Label>
                  <Input defaultValue="Requests per Second" />
                </div>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Preview area</p>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Discard</Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    );
  },
};
