'use client';

import { useRouter } from '@/i18n/navigation';
import { Dialog, DialogContent } from '@/libs/components/ui/dialog';
import { ReactNode, useState } from 'react';

export default function DishModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) router.back();
      }}
    >
      <DialogContent className="overflow-y-auto max-w-[800px] max-h-full">{children}</DialogContent>
    </Dialog>
  );
}
