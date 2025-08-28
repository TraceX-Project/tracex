import React from 'react';

import { Command, CommandInput } from '@/shared/components/ui/command';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { List } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Input } from '@/shared/components/ui/input';

export const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="absolute top-6.25 z-10 mx-5 h-fit w-fit">
          <List />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          <Label className="">Search</Label>
          <Command className="h-fit w-full rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
          </Command>
        </div>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
