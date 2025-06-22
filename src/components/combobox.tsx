'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { FormControl } from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

type Item = {
  value: string;
  label: string;
};

export function ComboBoxResponsive({
  selectedBrewerId,
  setSelectedBrewerId,
  items,
  setSelectedItem,
  selectedItem,
  label = 'Select...',
}: {
  selectedBrewerId?: string | null;
  setSelectedBrewerId?: (id: string) => void;
  items: Item[];
  setSelectedItem: (item: Item | null) => void;
  selectedItem: Item | null;
  label: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    const handleBrewerChange = (id: string) => {
      if (setSelectedBrewerId) setSelectedBrewerId(id);
    };
    return (
      <Select
        value={selectedBrewerId ?? undefined}
        onValueChange={handleBrewerChange}
      >
        <FormControl>
          <SelectTrigger className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70'>
            <SelectValue placeholder='Select brewing method' />
          </SelectTrigger>
        </FormControl>
        <SelectContent className='bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'>
          {items.map((status: Item) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='w-full justify-start'>
          {selectedItem ? <>{selectedItem.label}</> : <>{label}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-md mt-4'>
          <StatusList
            setOpen={setOpen}
            setSelectedItem={setSelectedItem}
            items={items}
            label={label}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedItem,
  items,
  label,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | null) => void;
  items: Item[];
  label: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={label} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setSelectedItem(
                  items.find((item) => item.value === value) || null
                );
                setOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
