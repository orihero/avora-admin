import { DashboardData } from '../../domain/entities/DashboardData';

export const MOCK_DASHBOARD_DATA: DashboardData = {
    topCards: [
        {
            icon: 'solar:user-circle-bold-duotone',
            label: 'Employees',
            count: 96,
            color: 'text-rose-600',
            bgColor: 'bg-pink-50',
        },
        {
            icon: 'solar:suitcase-tag-bold-duotone',
            label: 'Clients',
            count: '3,650',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
        {
            icon: 'solar:inbox-bold-duotone',
            label: 'Projects',
            count: 356,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
        },
        {
            icon: 'solar:medal-ribbons-star-bold-duotone',
            label: 'Events',
            count: 696,
            color: 'text-rose-600',
            bgColor: 'bg-orange-50',
        },
        {
            icon: 'solar:chat-round-dots-bold-duotone',
            label: 'Payroll',
            count: '$96k',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
        },
        {
            icon: 'solar:share-bold-duotone',
            label: 'Reports',
            count: 59,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
    ],
    revenueUpdates: {
        stats: {
            totalEarnings: '$63,489.50',
            earningsThisMonth: '$48,820',
            expenseThisMonth: '$26,498',
        },
        chartData: {
            categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08'],
            earnings: [1.5, 2.8, 3.5, 3.9, 2.5, 3.1, 4.2], // Scaled values for visualization
            expenses: [-1.2, -1.5, -2.1, -1.8, -0.9, -1.5, -1.1],
        },
    },
    yearlyBreakup: {
        year: 2023,
        amount: '$36,358',
        growth: '+9%',
        chartData: [38, 40, 25],
    },
    monthlyEarnings: {
        amount: '$6,820',
        growth: '+9%',
        chartData: [20, 45, 30, 50, 40, 60, 55, 70, 75, 40, 25],
    },
    employeeSalary: {
        chartLabels: ['04 Apr', '05 May', '06 Jun', '07 Jul', '08 Aug', '09 Sep'],
        salary: [20, 25, 30, 45, 15, 25],
    },
    customerGrowth: {
        count: '36,358',
        growth: '+9%',
        chartData: [0, 10, 25, 15, 35, 20, 45, 40],
    },
    projectGrowth: {
        count: '78,298',
        growth: '+9%',
        chartData: [10, 25, 15, 35, 20, 45, 40, 55],
    },
    weeklyStats: {
        chartData: [5, 15, 5, 20, 15, 35, 20],
        topSales: { name: 'Top sales', tag: 'Johnathan Doe', count: '+68' },
        bestSeller: { name: 'Best seller', tag: 'MaterialPro Admin', count: '+68' },
        mostCommented: { name: 'Most commented', tag: 'Ample Admin', count: '+68' },
    },
    topProjects: [
        {
            id: '1',
            assigned: {
                name: 'Sunil Joshi',
                role: 'Web Designer',
                avatar: 'https://i.pravatar.cc/150?u=1',
            },
            project: 'Elite admin',
            priority: 'Low',
            budget: '$3.5k',
        },
        {
            id: '2',
            assigned: {
                name: 'John Doe',
                role: 'Web Designer',
                avatar: 'https://i.pravatar.cc/150?u=2',
            },
            project: 'Elite admin',
            priority: 'Medium',
            budget: '$3.5k',
        },
        {
            id: '3',
            assigned: {
                name: 'Nirav Joshi',
                role: 'Web Designer',
                avatar: 'https://i.pravatar.cc/150?u=3',
            },
            project: 'Material Design',
            priority: 'High',
            budget: '$3.5k',
        },
        {
            id: '4',
            assigned: {
                name: 'Yuvraj Sheth',
                role: 'Project Manager',
                avatar: 'https://i.pravatar.cc/150?u=4',
            },
            project: 'Spike Dashboard',
            priority: 'Low',
            budget: '$3.5k',
        },
        {
            id: '5',
            assigned: {
                name: 'Micheal Doe',
                role: 'Content Writer',
                avatar: 'https://i.pravatar.cc/150?u=5',
            },
            project: 'Elite admin',
            priority: 'High',
            budget: '$3.5k',
        },
    ],
};
