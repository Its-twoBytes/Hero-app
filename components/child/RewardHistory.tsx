
import React from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';

const RewardHistory: React.FC = () => {
  const { kids, currentUser } = useFamilyData();
  const currentKid = kids.find(k => k.id === currentUser?.id);

  if (!currentKid || currentKid.rewardHistory.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold mb-3 text-brand-primary-800 border-b pb-2">المكافآت التي حصلت عليها</h3>
        <p className="text-gray-500 mt-4">لم تحصل على أي مكافآت بعد. استمر في جمع النقاط!</p>
      </div>
    );
  }
  
  const sortedHistory = [...currentKid.rewardHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-3 text-brand-primary-800 border-b pb-2">المكافآت التي حصلت عليها</h3>
      <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {sortedHistory.map((event) => (
          <li key={event.id} className="flex items-center justify-between p-2 bg-brand-secondary-50 rounded-md">
            <div>
                <p className="font-semibold text-brand-secondary-800">{event.rewardName}</p>
                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('ar-EG')}</p>
            </div>
            <span className="text-xs font-medium text-white bg-brand-secondary-500 px-2 py-1 rounded-full">
                {event.grantedBy === 'parent' ? 'ممنوحة' : 'مستبدلة'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RewardHistory;
