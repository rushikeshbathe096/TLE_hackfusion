"use client";

import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentChartProps {
    data: {
        name: string;
        total: number;
        resolved: number;
        fill: string;
    }[];
}

export default function DepartmentCharts({ data }: DepartmentChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    if (!data || data.length === 0) return null;

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((dept, idx) => (
                <div key={idx} className="bg-card/30 backdrop-blur-sm border border-border/50 p-6 rounded-xl flex flex-col items-center">
                    <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                        {dept.name}
                    </h4>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[dept]}>
                                <XAxis
                                    dataKey="name"
                                    hide
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        borderColor: isDark ? '#334155' : '#e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="total" name="Total Reports" radius={[4, 4, 0, 0]}>
                                    <Cell fill={dept.fill} fillOpacity={0.3} />
                                </Bar>
                                <Bar dataKey="resolved" name="Resolved" radius={[4, 4, 0, 0]}>
                                    <Cell fill={dept.fill} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.fill, opacity: 1 }}></span>
                            <span>Resolved: {dept.resolved}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.fill, opacity: 0.3 }}></span>
                            <span>Total: {dept.total}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
