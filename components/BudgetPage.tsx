
import React, { useState, useEffect } from 'react';

const BudgetPage: React.FC = () => {
    // 1. STATE
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalBudget, setTotalBudget] = useState<number>(14000);
    const [schedule, setSchedule] = useState<{ label: string; date: string; amount: string; status: string }[]>([]);

    // 2. LOGIC
    useEffect(() => {
        const start = new Date(startDate);
        const newSchedule = [];

        // Logic: Standard Payment Plan (formerly withWebsite=true)
        newSchedule.push({
            label: 'Advance Payment',
            date: 'Immediate',
            amount: '₹5,000',
            status: 'Triggers Website Work (7-12 Days)'
        });
        
        const weeklyAmount = totalBudget > 0 ? totalBudget / 4 : 0;
        const formattedWeeklyAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(weeklyAmount);

        // Generate 4 weeks of marketing payments (Split totalBudget / 4)
        for (let i = 0; i < 4; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + (i * 7)); // Add 0, 7, 14, 21 days
            newSchedule.push({
                label: `Week ${i + 1} Marketing`,
                // Format date nicely (e.g., "Jan 14, 2024")
                date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                amount: formattedWeeklyAmount,
                status: 'Ad Spend & Management'
            });
        }
        
        setSchedule(newSchedule);
    }, [startDate, totalBudget]);

    // 3. UI RENDER
    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-4 sm:p-8 bg-slate-50 overflow-y-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 mt-4 text-center">
                Payment & Implementation Schedule
            </h2>

            {/* The Card Container */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-neutral-200">
                
                {/* Left Panel: Blue background, Date Input */}
                <div className="w-full md:w-1/3 bg-blue-600 p-6 text-white flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-4">Plan Your Start</h3>
                    <p className="mb-6 opacity-90 text-sm">Enter the total marketing budget to see the weekly breakdown.</p>
                    
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Total Marketing Budget (4 Weeks)</label>
                    <input 
                        type="number" 
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg text-gray-800 font-bold mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400"
                        placeholder="e.g. 14000"
                    />

                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Marketing Start Date</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 rounded-lg text-gray-800 font-bold mb-6 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />

                    <div className="bg-blue-700 p-4 rounded-lg border border-blue-500 animate-fade-in">
                        <p className="text-sm font-bold text-yellow-300">
                            ⚠️Follow Correct payment cycle to maintain and reach Goal!
                        </p>
                    </div>
                </div>

                {/* Right Panel: White background, The List */}
                <div className="w-full md:w-2/3 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                        <span className="bg-green-100 text-green-700 p-2 rounded-full text-sm">
                            Marketing + Website Plan
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">
                            Total Est: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalBudget + 5000)}
                        </span>
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Map through the calculated schedule array */}
                        {schedule.map((item, index) => (
                            <div 
                                key={index}
                                // Standard CSS Animation mimicking framer-motion stagger
                                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 animate-fade-in opacity-0"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: 'forwards' 
                                }}
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-700">{item.label}</span>
                                    <span className="text-xs text-gray-500">{item.status}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-blue-600 text-lg">{item.date}</span>
                                    <span className="block text-sm font-semibold text-gray-600">{item.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
