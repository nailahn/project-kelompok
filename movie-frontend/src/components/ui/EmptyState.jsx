export default function EmptyState({ title, description, icon }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-olive-700/50 border border-white/8 flex items-center justify-center text-white/25 mb-4">
                {icon}
            </div>
            <h3 className="font-serif text-xl text-white/60 mb-1">{title}</h3>
            <p className="text-white/35 text-sm font-sans max-w-xs">
                {description}
            </p>
        </div>
    );
}
