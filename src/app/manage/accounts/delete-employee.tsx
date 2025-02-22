import { AccountListResType } from '@/domain/schemas/account.schema';
import { useDeleteAccountMutation } from '@/infrastructure/queries/useMe';
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

type AccountItem = AccountListResType['data'][0];

export function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete
}: {
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}) {
  const deleteAccount = useDeleteAccountMutation();

  const handleDelete = async () => {
    if (!employeeDelete) return;

    if (deleteAccount.isPending) return;

    try {
      const response = await deleteAccount.mutateAsync(employeeDelete?.id);
      toast({
        description: response.payload.message,
        variant: 'success'
      });
      setEmployeeDelete(null);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className="bg-foreground text-primary-foreground rounded px-1">{employeeDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={deleteAccount.isPending} onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
