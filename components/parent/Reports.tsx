import React, { useState, useMemo } from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

type FilterType = 'all' | 'week' | 'month';

// Icon components for stat cards
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;


const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">{`النقاط المكتسبة: ${payload.find(p => p.dataKey === 'النقاط المكتسبة')?.value || 0}`}</p>
          <p className="text-red-600">{`النقاط المفقودة: ${payload.find(p => p.dataKey === 'النقاط المفقودة')?.value || 0}`}</p>
        </div>
      );
    }
    return null;
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);

const Reports: React.FC = () => {
    const { kids } = useFamilyData();
    const [filter, setFilter] = useState<FilterType>('all');

    const { chartData, stats } = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        let totalEarned = 0;
        let totalLost = 0;
        let mostActive = { name: '-', count: 0 };

        const data = kids.map(kid => {
            const filteredHistory = kid.pointHistory.filter(event => {
                if (filter === 'all') return true;
                const eventDate = new Date(event.date);
                if (filter === 'week') return eventDate >= oneWeekAgo;
                if (filter === 'month') return eventDate >= oneMonthAgo;
                return true;
            });

            const earned = filteredHistory.filter(e => e.points > 0).reduce((sum, e) => sum + e.points, 0);
            const lost = filteredHistory.filter(e => e.points < 0).reduce((sum, e) => sum + e.points, 0);

            totalEarned += earned;
            totalLost += lost;

            if(filteredHistory.length > mostActive.count) {
                mostActive = { name: kid.name, count: filteredHistory.length };
            }

            return {
                name: kid.name,
                'النقاط المكتسبة': earned,
                'النقاط المفقودة': Math.abs(lost),
            };
        });

        return {
            chartData: data,
            stats: { totalEarned, totalLost: Math.abs(totalLost), mostActive }
        };
    }, [kids, filter]);

    const filters: {key: FilterType, label: string}[] = [
        { key: 'all', label: 'كل الأوقات' },
        { key: 'week', label: 'هذا الأسبوع' },
        { key: 'month', label: 'هذا الشهر' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-start items-center">
                 <div className="flex flex-wrap gap-2">
                    {filters.map(({key, label}) => (
                         <button 
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === key ? 'bg-brand-primary-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                         >
                            {label}
                         </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="إجمالي النقاط المكتسبة" value={stats.totalEarned} icon={<TrendingUpIcon />} colorClass="bg-green-100 text-green-600" />
                <StatCard title="إجمالي النقاط المفقودة" value={stats.totalLost} icon={<TrendingDownIcon />} colorClass="bg-red-100 text-red-600" />
                <StatCard title="الطفل الأكثر نشاطاً" value={stats.mostActive.name} icon={<StarIcon />} colorClass="bg-brand-accent-100 text-brand-accent-700" />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">مقارنة أداء الأطفال</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="category" dataKey="name" />
                            <YAxis type="number" />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(230, 230, 230, 0.5)'}}/>
                            <Legend />
                            <ReferenceLine y={0} stroke="#666" />
                            <Bar dataKey="النقاط المكتسبة" fill="#4ade80" />
                            <Bar dataKey="النقاط المفقودة" fill="#f87171" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;