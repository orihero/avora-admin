import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { GetDashboardData } from '../../domain/usecases/GetDashboardData';

export const useDashboardData = () => {
    const getDashboardData = container.resolve(GetDashboardData);

    return useQuery({
        queryKey: ['dashboard'],
        queryFn: () => getDashboardData.execute(),
    });
};
