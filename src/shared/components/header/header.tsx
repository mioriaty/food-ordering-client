'use client';

import { Menu, MoveRight, Package2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/shared/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';

import { ModeToggle } from '@/shared/components/dark-mode-toggle';
import LoginButton from '@/shared/components/header/login-button';

interface NavigationItem {
  title: string;
  href?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Home',
    href: '/',
    description: ''
  },
  {
    title: 'Menu',
    href: '/menu'
  },
  {
    title: 'Orders',
    href: '/orders'
  }
];

const NavigationMenuItemComponent = ({ item }: { item: NavigationItem }) => (
  <NavigationMenuItem key={item.title}>
    <NavigationMenuLink href={item.href}>
      <Button variant="ghost">{item.title}</Button>
    </NavigationMenuLink>
  </NavigationMenuItem>
);

const MobileNavigationItem = ({ item }: { item: NavigationItem }) => (
  <div key={item.title}>
    <div className="flex flex-col gap-2">
      {item.href ? (
        <Link href={item.href} className="flex justify-between items-center">
          <span className="text-lg">{item.title}</span>
          <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
        </Link>
      ) : (
        <p className="text-lg">{item.title}</p>
      )}
    </div>
  </div>
);

export const Header = () => {
  return (
    <header className="w-full bg-background border-b border-gray-300">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItemComponent key={item.title} item={item} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex lg:justify-center">
          <p className="font-semibold">Tomio</p>
        </div>
        <div className="flex justify-end w-full gap-4">
          <ModeToggle />
          <LoginButton />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Big boy</span>
              </Link>

              <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background py-4 container gap-8">
                {navigationItems.map((item) => (
                  <MobileNavigationItem key={item.title} item={item} />
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
