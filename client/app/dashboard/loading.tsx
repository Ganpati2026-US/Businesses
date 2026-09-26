export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-7 bg-slate-200 rounded-lg w-40 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-72"></div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5">
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-slate-100 w-10 h-10"></div>
                        </div>
                        <div className="mt-4">
                            <div className="h-7 bg-slate-200 rounded w-16 mb-1"></div>
                            <div className="h-4 bg-slate-100 rounded w-24"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 h-20"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
