import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { EmployeeSalaryData } from '../../domain/entities/DashboardData';

interface EmployeeSalaryChartProps {
    data: EmployeeSalaryData;
}

export const EmployeeSalaryChart = ({ data }: EmployeeSalaryChartProps) => {
    const chartData = data.chartLabels.map((label, i) => ({
        name: label,
        salary: data.salary[i],
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Employee salary</h3>
            <p className="text-sm text-gray-500 mb-6">Every month</p>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={20}>
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <Bar
                            dataKey="salary"
                            fill="#EFF4FF"
                            radius={[4, 4, 4, 4]}

                        />
                        {/* Note: In Recharts, creating generic individual bar styling based on value or hovering needs custom shapes or Cell mapping. 
                 For simplicity, using a uniform color or alternating could be done. The design shows mix of colors. 
                 Let's stick to a primary color or map for specific bars if needed to match screenshot strictly.
                 The screenshot shows standard bars. Let's use a nice Primary blue for all for now, or mapped manually.
              */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 5.2L3.8 5.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 11.2L3.8 11.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 18L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 17.2L3.8 17.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Total Sales</p>
                        <h6 className="text-sm font-bold text-gray-800">$36,358</h6>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-50 rounded text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 5.2L3.8 5.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 11.2L3.8 11.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 18L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3.80002 17.2L3.8 17.20001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Expenses</p>
                        <h6 className="text-sm font-bold text-gray-800">$5,296</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};
