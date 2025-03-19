import { TableListResType } from '@/domain/schemas/table.schema';
import { useDeleteTableMutation } from '@/infrastructure/queries/useTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/libs/components/ui/alert-dialog';
import { toast } from '@/libs/components/ui/use-toast';
import { handleErrorApi } from '@/libs/utils/handle-api-error';

type TableItem = TableListResType['data'][0];

export function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete
}: {
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}) {
  const deleteTableMutation = useDeleteTableMutation();

  const handleDelete = async () => {
    if (!tableDelete) return;

    if (deleteTableMutation.isPending) return;

    try {
      const response = await deleteTableMutation.mutateAsync(tableDelete.number);
      toast({
        description: response.payload.message,
        variant: 'success'
      });
      setTableDelete(null);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn <span className="bg-foreground text-primary-foreground rounded px-1">{tableDelete?.number}</span> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
