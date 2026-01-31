import { useDashboardData } from './hooks/useDashboardData';
import { TopCards } from './components/TopCards';
import { RevenueUpdatesChart } from './components/RevenueUpdatesChart';
import { YearlyBreakupChart } from './components/YearlyBreakupChart';
import { MonthlyEarningsChart } from './components/MonthlyEarningsChart';
import { EmployeeSalaryChart } from './components/EmployeeSalaryChart';
import { SparklineCard } from './components/SparklineCard';
import { WeeklyStatsChart } from './components/WeeklyStatsChart';
import { TopProjectsTable } from './components/TopProjectsTable';

export const DashboardHelper = () => {
    const { data, isLoading } = useDashboardData();

    if (isLoading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-slate-900 min-h-screen">
            {/* Top Stats Cards Row */}
            <TopCards cards={data.topCards} />

            {/* Second Row: Revenue Updates (2/3) + Yearly/Monthly (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 h-full">
                    <RevenueUpdatesChart data={data.revenueUpdates.chartData} stats={data.revenueUpdates.stats} />
                </div>
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex-1">
                        <YearlyBreakupChart data={data.yearlyBreakup} />
                    </div>
                    <div className="flex-1">
                        <MonthlyEarningsChart data={data.monthlyEarnings} />
                    </div>
                </div>
            </div>

            {/* Third Row: Employee Salary, Sparklines, Weekly Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Employee Salary */}
                <div className="lg:col-span-1">
                    <EmployeeSalaryChart data={data.employeeSalary} />
                </div>

                {/* Middle Column: 2 Sparklines Cards */}
                <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div className="h-[200px]">
                        <SparklineCard
                            title="Customers"
                            count={data.customerGrowth.count}
                            growth={data.customerGrowth.growth}
                            chartData={data.customerGrowth.chartData}
                            color="#38BDF8"
                        />
                    </div>
                    <div className="h-[200px]">
                        <SparklineCard
                            title="Projects"
                            count={data.projectGrowth.count}
                            growth={data.projectGrowth.growth}
                            chartData={data.projectGrowth.chartData}
                            color="#FCD34D" // Amber/Yellow
                        />
                    </div>
                </div>

                {/* Weekly Stats */}
                <div className="lg:col-span-1">
                    <WeeklyStatsChart data={data.weeklyStats} />
                </div>
            </div>

            {/* Fourth Row: Top Projects Table */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <TopProjectsTable projects={data.topProjects} />
            </div>

            <div className="text-center w-full mt-10 mb-4 opacity-70 text-sm text-slate-600 dark:text-slate-400">
                <p>Built with ❤️ by Antigravity</p>
            </div>

        </div>
    );
};

export default DashboardHelper;
