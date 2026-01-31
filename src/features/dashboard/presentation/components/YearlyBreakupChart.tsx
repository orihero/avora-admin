import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '@iconify/react';
import { YearlyBreakupData } from '../../domain/entities/DashboardData';

interface YearlyBreakupChartProps {
    data: YearlyBreakupData;
}

export const YearlyBreakupChart = ({ data }: YearlyBreakupChartProps) => {
    const chartData = [
        { name: '2022', value: data.chartData[0], color: '#6366F1' },
        { name: '2023', value: data.chartData[1], color: '#ECF2FF' }, // Light blue
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Yearly Backup</h3>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-1">{data.amount}</h4>
                    <div className="flex items-center text-sm mb-4">
                        <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full mr-2">
                            <Icon icon="solar:arrow-left-up-linear" className="w-3 h-3 rotate-45" />
                        </span>
                        <span className="font-semibold text-gray-700 mr-1">{data.growth}</span>
                        <span className="text-gray-400">last year</span>
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                            2022
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-indigo-50 mr-1"></span>
                            2023
                        </div>
                    </div>
                </div>

                <div className="w-[120px] h-[120px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={55}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
