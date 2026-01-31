export interface TopCardStat {
    icon: string;
    label: string;
    count: string | number;
    color: string;
    bgColor: string;
    extraText?: string;
}

export interface RevenueUpdateData {
    categories: string[];
    earnings: number[];
    expenses: number[];
}

export interface RevenueStats {
    totalEarnings: string;
    earningsThisMonth: string;
    expenseThisMonth: string;
}

export interface YearlyBreakupData {
    year: number;
    amount: string;
    growth: string;
    chartData: number[]; // e.g. [38, 40, 25]
}

export interface MonthlyEarningsData {
    amount: string;
    growth: string;
    chartData: number[];
}

export interface EmployeeSalaryData {
    chartLabels: string[];
    salary: number[];
}

export interface WeeklyStatsData {
    chartData: number[];
    topSales: { name: string; tag: string; count: string; };
    bestSeller: { name: string; tag: string; count: string; };
    mostCommented: { name: string; tag: string; count: string; };
}

export interface ProjectData {
    id: string;
    assigned: {
        name: string;
        role: string;
        avatar: string;
    };
    project: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    budget: string;
}

export interface DashboardData {
    topCards: TopCardStat[];
    revenueUpdates: {
        chartData: RevenueUpdateData;
        stats: RevenueStats;
    };
    yearlyBreakup: YearlyBreakupData;
    monthlyEarnings: MonthlyEarningsData;
    employeeSalary: EmployeeSalaryData;
    customerGrowth: {
        count: string;
        growth: string;
        chartData: number[];
    };
    projectGrowth: {
        count: string;
        growth: string;
        chartData: number[];
    };
    weeklyStats: WeeklyStatsData;
    topProjects: ProjectData[];
}
