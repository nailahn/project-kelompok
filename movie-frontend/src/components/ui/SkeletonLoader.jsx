export default function SkeletonLoader() {
    return (
        <div className="animate-pulse">
            {/* Hero skeleton */}
            <div className="relative">
                <div className="w-full h-[45vh] skeleton" />
                <div className="px-4 md:px-8 max-w-5xl mx-auto">
                    <div className="flex gap-5 -mt-24 pb-6">
                        <div
                            className="w-32 md:w-44 skeleton rounded-lg"
                            style={{ aspectRatio: "2/3" }}
                        />
                        <div className="flex-1 pt-8 space-y-3">
                            <div className="skeleton h-8 w-3/4 rounded" />
                            <div className="skeleton h-4 w-1/4 rounded" />
                            <div className="skeleton h-3 w-full rounded" />
                            <div className="skeleton h-3 w-5/6 rounded" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Gallery skeleton */}
            <div className="px-4 md:px-8 max-w-5xl mx-auto">
                <div className="skeleton h-4 w-16 rounded mx-auto mb-4" />
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="skeleton aspect-video rounded"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
