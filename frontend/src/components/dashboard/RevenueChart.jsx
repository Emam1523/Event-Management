const RevenueChart = ({ data = [] }) => {
  // Simple CSS-based bar chart for revenue visualization
  const maxVal = Math.max(...data.map(d => d.amount), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6">Revenue Overview</h3>
      
      <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px] px-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            <div 
              className="w-full bg-primary-100 group-hover:bg-primary-500 rounded-t-lg transition-all duration-300 relative"
              style={{ height: `${(d.amount / maxVal) * 100}%` }}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                ৳{d.amount.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
