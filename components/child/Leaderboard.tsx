
import React from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';

const Leaderboard: React.FC = () => {
  const { kids, currentUser } = useFamilyData();
  
  const sortedKids = [...kids].sort((a, b) => b.points - a.points);
  
  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-3 text-brand-primary-800 border-b pb-2">لوحة الأبطال</h3>
      <ul className="space-y-3">
        {sortedKids.map((kid, index) => (
          <li
            key={kid.id}
            className={`flex items-center justify-between p-2 rounded-md ${
              kid.id === currentUser?.id ? 'bg-brand-accent-100 ring-2 ring-brand-accent-400' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="font-bold text-lg w-8 text-center">{getRankIcon(index)}</span>
              <span className="font-semibold text-brand-dark">{kid.name}</span>
            </div>
            <span className="font-bold text-brand-accent-600">{kid.points} نقطة</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
