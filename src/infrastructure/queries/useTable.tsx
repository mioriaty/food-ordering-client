import { UpdateTableBodyType } from '@/domain/schemas/table.schema';
import tableService from '@/infrastructure/services/table.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetListTableQuery = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableService.list
  });
};

export const useGetTableByIdQuery = ({ id, enabledCall }: { id: number; enabledCall: boolean }) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableService.getOne(id),
    enabled: enabledCall
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) => tableService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  });
};

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  });
};
