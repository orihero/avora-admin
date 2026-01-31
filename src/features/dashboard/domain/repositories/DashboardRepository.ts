import { DashboardData } from '../entities/DashboardData';

export interface DashboardRepository {
    getDashboardData(): Promise<DashboardData>;
}
