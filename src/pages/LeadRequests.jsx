import { useEffect, useState } from "react";
import { getLeadRequests } from "../services/api";

const LeadRequests = () => {
    const [leads, setLeads] = useState([]);

    const loadLeads = async () => {
        try {
            const data = await getLeadRequests();
            setLeads(data);
        } catch (error) {
            console.error("Не удалось загрузить заявки", error);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-6">Заявки</h1>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-gray-900 border border-gray-700 text-sm text-white">
                    <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left">Имя</th>
                        <th className="px-4 py-3 text-left">Контакт</th>
                        <th className="px-4 py-3 text-left">Мессенджер</th>
                        <th className="px-4 py-3 text-left">Комментарий</th>
                        <th className="px-4 py-3 text-left">UTM Source</th>
                        <th className="px-4 py-3 text-left">UTM Medium</th>
                        <th className="px-4 py-3 text-left">UTM Campaign</th>
                        <th className="px-4 py-3 text-left">Создана</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2">{lead.name}</td>
                            <td className="px-4 py-2">{lead.contact}</td>
                            <td className="px-4 py-2">{lead.messenger}</td>
                            <td className="px-4 py-2">{lead.message || "-"}</td>
                            <td className="px-4 py-2">{lead.utm_source || "-"}</td>
                            <td className="px-4 py-2">{lead.utm_medium || "-"}</td>
                            <td className="px-4 py-2">{lead.utm_campaign || "-"}</td>
                            <td className="px-4 py-2">
                                {new Date(lead.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadRequests;
