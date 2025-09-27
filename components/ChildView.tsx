import React, { useState, useMemo } from 'react';
import { useFamilyData } from '../contexts/FamilyDataContext';
import Avatar from './shared/Avatar';
import Leaderboard from './child/Leaderboard';
import RewardHistory from './child/RewardHistory';
import Confetti from './shared/Confetti';
import AvatarSelectionModal from './shared/AvatarSelectionModal';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
);


const ChildView: React.FC = () => {
  const { currentUser, setCurrentUser, kids, rewards, redeemReward, updateKid } = useFamilyData();
  const [showConfetti, setShowConfetti] = useState(false);
  const [redeemedMessage, setRedeemedMessage] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const currentKid = useMemo(() => kids.find(k => k.id === currentUser?.id), [kids, currentUser]);

  if (!currentKid || !currentUser) return null; // Should not happen

  const handleRedeem = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if(reward) {
      redeemReward(currentKid.id, rewardId);
      setShowConfetti(true);
      setRedeemedMessage(`تهانينا! لقد حصلت على: ${reward.name}`);
      setTimeout(() => setShowConfetti(false), 4000);
      setTimeout(() => setRedeemedMessage(null), 4000);
    }
  };

  const handleAvatarUpdate = (newAvatar: string) => {
    updateKid(currentKid.id, currentKid.name, newAvatar);
  }

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
       <Confetti active={showConfetti} />
       <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} onSelect={handleAvatarUpdate} />

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="relative shrink-0">
                <Avatar src={currentKid.avatar} size="md" />
                <button onClick={() => setIsAvatarModalOpen(true)} className="absolute bottom-0 right-0 bg-brand-primary-600 rounded-full p-1.5 border-2 border-white hover:bg-brand-primary-700">
                    <EditIcon />
                </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mr-4">أهلاً بك، {currentKid.name}!</h1>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"
          >
            الخروج
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-brand-primary-600 to-brand-primary-800 text-white rounded-xl shadow-2xl p-6 sm:p-8 text-center">
              <p className="text-lg opacity-80">رصيدك الحالي من النقاط</p>
              <p className="text-6xl sm:text-7xl font-black my-2">{currentKid.points}</p>
            </div>
            
            {redeemedMessage && (
                <div className="bg-brand-secondary-500 text-white text-center font-bold p-4 rounded-lg shadow-lg animate-fade-in-down">
                    {redeemedMessage}
                </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-4">المكافآت المتاحة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map(reward => {
                    const canAfford = currentKid.points >= reward.cost;
                    const progress = Math.min((currentKid.points / reward.cost) * 100, 100);
                    return (
                    <div key={reward.id} className="bg-white p-5 rounded-xl shadow-md flex flex-col">
                        <div className="flex items-center mb-3">
                        <span className="text-5xl mr-4">{reward.icon}</span>
                        <div>
                            <h4 className="text-xl font-bold text-brand-dark">{reward.name}</h4>
                            <p className="text-brand-accent-600 font-semibold">{reward.cost} نقطة</p>
                        </div>
                        </div>
                        <div className="flex-grow"></div>
                        {canAfford ? (
                        <button onClick={() => handleRedeem(reward.id)} className="w-full mt-4 bg-brand-secondary-500 text-white font-bold py-2 rounded-lg hover:bg-brand-secondary-600 transition-transform transform hover:scale-105">
                            استبدال
                        </button>
                        ) : (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm font-medium text-gray-500 mb-1">
                                <span>{currentKid.points} / {reward.cost}</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-brand-accent-500 h-4 rounded-full text-xs text-white flex items-center justify-center" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        )}
                    </div>
                    );
                })}
              </div>
            </div>
          </main>
          <aside className="space-y-8">
            <Leaderboard />
            <RewardHistory />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ChildView;