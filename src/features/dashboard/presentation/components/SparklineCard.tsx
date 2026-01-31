import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Icon } from '@iconify/react';

interface SparklineCardProps {
    title: string;
    count: string;
    growth: string;
    chartData: number[];
    color: string; // hex color for the line
}

export const SparklineCard = ({ title, count, growth, chartData, color }: SparklineCardProps) => {
    const data = chartData.map((val) => ({ value: val }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full relative overflow-hidden flex flex-col justify-between dark:bg-slate-800 dark:border-slate-700">
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{count}</h4>
                <div className="flex items-center text-xs mb-4">
                    <span className="flex items-center justify-center w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full mr-1">
                        <Icon icon="solar:arrow-left-up-linear" className="w-2.5 h-2.5 rotate-45" />
                    </span>
                    <span className="font-medium text-gray-700">{growth}</span>
                </div>
            </div>

            <div className="h-[60px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#gradient-${color})`}
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
