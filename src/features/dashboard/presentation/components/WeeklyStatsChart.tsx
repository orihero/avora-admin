import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '@iconify/react';
import { WeeklyStatsData } from '../../domain/entities/DashboardData';

interface WeeklyStatsChartProps {
    data: WeeklyStatsData;
}

export const WeeklyStatsChart = ({ data }: WeeklyStatsChartProps) => {
    const chartData = data.chartData.map((val) => ({ value: val }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Weekly stats</h3>
            <p className="text-sm text-gray-500 mb-6">Average sales</p>

            <div className="h-[130px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
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
                            fill="url(#colorWeekly)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Icon icon="solar:cart-large-minimalistic-linear" className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{data.topSales.name}</h4>
                            <p className="text-xs text-gray-400">{data.topSales.tag}</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded">
                        {data.topSales.count}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Icon icon="solar:star-linear" className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{data.bestSeller.name}</h4>
                            <p className="text-xs text-gray-400">{data.bestSeller.tag}</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded">
                        {data.bestSeller.count}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600">
                            <Icon icon="solar:chat-line-linear" className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{data.mostCommented.name}</h4>
                            <p className="text-xs text-gray-400">{data.mostCommented.tag}</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                        {data.mostCommented.count}
                    </div>
                </div>
            </div>
        </div>
    );
};
