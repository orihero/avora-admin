import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '@iconify/react';
import { MonthlyEarningsData } from '../../domain/entities/DashboardData';

interface MonthlyEarningsChartProps {
    data: MonthlyEarningsData;
}

export const MonthlyEarningsChart = ({ data }: MonthlyEarningsChartProps) => {
    const chartData = data.chartData.map((val) => ({ value: val }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full relative overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Monthly earnings</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
                    <Icon icon="solar:dollar-minimalistic-linear" className="w-6 h-6" />
                </div>
            </div>

            <h4 className="text-2xl font-bold text-gray-800 mb-1">{data.amount}</h4>
            <div className="flex items-center text-sm mb-6">
                <span className="flex items-center justify-center w-5 h-5 bg-rose-100 text-rose-600 rounded-full mr-2">
                    <Icon icon="solar:arrow-left-down-linear" className="w-3 h-3 -rotate-45" />
                </span>
                <span className="font-semibold text-gray-700 mr-1">{data.growth}</span>
                <span className="text-gray-400">last year</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ display: 'none' }} cursor={{ stroke: '#6366F1', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366F1"
                            strokeWidth={2}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
