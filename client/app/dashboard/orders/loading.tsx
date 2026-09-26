export default function OrdersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-64"></div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50">
                        <div className="h-4 bg-gray-100 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 flex-1"></div>
                        <div className="h-6 bg-gray-100 rounded-full w-20"></div>
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
