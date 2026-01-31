import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { RevenueUpdateData, RevenueStats } from '../../domain/entities/DashboardData';

interface RevenueUpdatesChartProps {
    data: RevenueUpdateData;
    stats: RevenueStats;
}

export const RevenueUpdatesChart = ({ data, stats }: RevenueUpdatesChartProps) => {
    // Transform data for Recharts
    const chartData = data.categories.map((cat, index) => ({
        name: cat,
        earnings: data.earnings[index],
        expenses: data.expenses[index],
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full dark:bg-slate-800 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Revenue updates</h3>
                    <p className="text-sm text-gray-500">Overview of Profit</p>
                </div>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <select className="border-gray-200 text-sm text-gray-600 rounded-md p-1 focus:ring-0 focus:border-indigo-500">
                        <option>March 2025</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            stackOffset="sign"
                            margin={{
                                top: 5,
                                right: 0,
                                left: -20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="earnings" name="Earnings" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={8} />
                            <Bar dataKey="expenses" name="Expenses" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:w-1/3 flex flex-col justify-center space-y-6 pl-0 lg:pl-6 border-l border-gray-100 border-l-0 lg:border-l dark:border-slate-700">
                    <div className="text-center lg:text-left">
                        <h4 className="text-2xl font-bold text-gray-800">{stats.totalEarnings}</h4>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 mr-2"></div>
                            <div>
                                <p className="text-xs text-gray-500">Earnings this month</p>
                                <h5 className="text-lg font-semibold text-gray-800">{stats.earningsThisMonth}</h5>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 mr-2"></div>
                            <div>
                                <p className="text-xs text-gray-500">Expense this month</p>
                                <h5 className="text-lg font-semibold text-gray-800">{stats.expenseThisMonth}</h5>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                        View full report
                    </button>
                </div>
            </div>
        </div>
    );
};
