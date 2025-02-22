import { UpdateDishBodyType } from '@/domain/schemas/dish.schema';
import dishService from '@/infrastructure/services/dish.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetListDishQuery = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishService.list
  });
};

export const useGetDishByIdQuery = ({ id, enabledCall }: { id: number; enabledCall: boolean }) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishService.getOne(id),
    enabled: enabledCall
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    }
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => dishService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    }
  });
};

export const useCreateDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    }
  });
};
