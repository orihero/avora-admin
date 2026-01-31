import { inject, injectable } from 'tsyringe';
import type { DashboardRepository } from '../repositories/DashboardRepository';
import { DashboardData } from '../entities/DashboardData';

@injectable()
export class GetDashboardData {
    constructor(
        @inject('DashboardRepository') private repository: DashboardRepository
    ) { }

    execute(): Promise<DashboardData> {
        return this.repository.getDashboardData();
    }
}
