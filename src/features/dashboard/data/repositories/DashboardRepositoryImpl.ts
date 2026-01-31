import { DashboardRepository } from '../../domain/repositories/DashboardRepository';
import { DashboardData } from '../../domain/entities/DashboardData';
import { MOCK_DASHBOARD_DATA } from '../datasources/MockDashboardDataSource';

export class DashboardRepositoryImpl implements DashboardRepository {
    async getDashboardData(): Promise<DashboardData> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_DASHBOARD_DATA;
    }
}
