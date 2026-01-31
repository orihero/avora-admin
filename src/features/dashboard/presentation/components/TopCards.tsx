import { Icon } from '@iconify/react';
import { TopCardStat } from '../../domain/entities/DashboardData';

interface TopCardsProps {
    cards: TopCardStat[];
}

export const TopCards = ({ cards }: TopCardsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`rounded-xl p-6 flex flex-col items-center justify-center text-center transition-shadow shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 ${card.bgColor}`}
                >
                    <div className="mb-4 flex justify-center">
                        <Icon icon={card.icon} className={`w-10 h-10 ${card.color}`} />
                    </div>
                    <p className={`text-sm font-medium ${card.color} mb-1`}>{card.label}</p>
                    <h3 className={`text-2xl font-bold ${card.color}`}>{card.count}</h3>
                </div>
            ))}
        </div>
    );
};
