import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../services/api";
import { format } from "date-fns";

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        active: 0,
        expired: 0,
        usage: 0,
        income: 0,
        expenses: 0,
        profit: 0,
    });

    const [dateRange, setDateRange] = useState({
        start: format(new Date(), "yyyy-MM-01"),
        end: format(new Date(), "yyyy-MM-dd"),
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardSummary(dateRange.start, dateRange.end);
                setStats(data);
            } catch (error) {
                console.error("Ошибка загрузки статистики:", error);
            }
        };

        loadStats();
    }, [dateRange]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center gap-4">
                <div>
                    <label className="text-sm text-gray-400 block mb-1">С даты</label>
                    <input
                        type="date"
                        name="start"
                        value={dateRange.start}
                        onChange={handleDateChange}
                        className="bg-[#1E293B] border border-[#334155] text-white px-3 py-2 rounded-lg"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-1">По дату</label>
                    <input
                        type="date"
                        name="end"
                        value={dateRange.end}
                        onChange={handleDateChange}
                        className="bg-[#1E293B] border border-[#334155] text-white px-3 py-2 rounded-lg"
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Всего пользователей" value={stats.users} />
                <StatCard label="Активных подписок" value={stats.active} />
                <StatCard label="Истекших" value={stats.expired} />
                <StatCard label="Использование" value={`${stats.usage}%`} />
                <StatCard label="Доход" value={`$${stats.income}`} />
                <StatCard label="Расходы" value={`$${stats.expenses}`} />
                <StatCard label="Профит" value={`$${stats.profit}`} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-6 shadow">
        <h2 className="text-sm text-gray-400">{label}</h2>
        <div className="text-3xl font-semibold text-white mt-2">{value}</div>
    </div>
);

export default Dashboard;
