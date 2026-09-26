export default function ProfileLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-72"></div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                        <div className="h-12 bg-sky-50 rounded-xl border border-sky-100"></div>
                    </div>
                ))}
                <div className="h-12 bg-sky-400/30 rounded-xl"></div>
            </div>
        </div>
    );
}
