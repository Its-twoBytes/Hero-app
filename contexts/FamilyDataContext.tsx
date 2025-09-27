
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Kid, Behavior, Reward, User, PointEvent, GrantedRewardEvent } from '../types';
import { KIDS_DATA, BEHAVIORS_DATA, REWARDS_DATA, PARENT_USER } from '../constants';

interface FamilyDataContextType {
  kids: Kid[];
  behaviors: Behavior[];
  rewards: Reward[];
  parent: User;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addKid: (name: string, avatar: string) => void;
  updateKid: (id: string, name: string, avatar: string) => void;
  deleteKid: (id: string) => void;
  addBehavior: (name: string, points: number, icon: string) => void;
  deleteBehavior: (id: string) => void;
  addReward: (name: string, cost: number, icon: string, description?: string) => void;
  deleteReward: (id: string) => void;
  assignPoints: (kidId: string, behaviorId: string) => void;
  grantReward: (kidId: string, rewardId: string) => void;
  redeemReward: (kidId: string, rewardId: string) => void;
}

const FamilyDataContext = createContext<FamilyDataContextType | undefined>(undefined);

export const FamilyDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kids, setKids] = useState<Kid[]>(KIDS_DATA);
  const [behaviors, setBehaviors] = useState<Behavior[]>(BEHAVIORS_DATA);
  const [rewards, setRewards] = useState<Reward[]>(REWARDS_DATA);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addKid = (name: string, avatar: string) => {
    const newKid: Kid = {
      id: `kid_${Date.now()}`,
      name,
      avatar,
      points: 0,
      pointHistory: [],
      rewardHistory: [],
    };
    setKids(prev => [...prev, newKid]);
  };

  const updateKid = (id: string, name: string, avatar: string) => {
    setKids(prev => prev.map(kid => (kid.id === id ? { ...kid, name, avatar } : kid)));
    if (currentUser && currentUser.id === id) {
        setCurrentUser(prev => prev ? {...prev, name, avatar} : null);
    }
  };

  const deleteKid = (id: string) => {
    setKids(prev => prev.filter(kid => kid.id !== id));
  };
  
  const addBehavior = (name: string, points: number, icon: string) => {
    const newBehavior: Behavior = { id: `b_${Date.now()}`, name, points, icon };
    setBehaviors(prev => [...prev, newBehavior]);
  };
  
  const deleteBehavior = (id: string) => {
    setBehaviors(prev => prev.filter(b => b.id !== id));
  };
  
  const addReward = (name: string, cost: number, icon: string, description?: string) => {
    const newReward: Reward = { id: `r_${Date.now()}`, name, cost, icon, description };
    setRewards(prev => [...prev, newReward]);
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };
  
  const assignPoints = (kidId: string, behaviorId: string) => {
    const behavior = behaviors.find(b => b.id === behaviorId);
    if (!behavior) return;
    
    const newPointEvent: PointEvent = {
        id: `ph_${Date.now()}`,
        behaviorId,
        behaviorName: behavior.name,
        points: behavior.points,
        date: new Date().toISOString(),
    };
    
    setKids(prev => prev.map(kid => 
      kid.id === kidId 
        ? { ...kid, points: kid.points + behavior.points, pointHistory: [...kid.pointHistory, newPointEvent] } 
        : kid
    ));
  };

  const grantReward = (kidId: string, rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const newGrantEvent: GrantedRewardEvent = {
        id: `rh_${Date.now()}`,
        rewardId,
        rewardName: reward.name,
        pointCost: reward.cost,
        date: new Date().toISOString(),
        grantedBy: 'parent',
    };

    setKids(prev => prev.map(kid =>
        kid.id === kidId
            ? { ...kid, rewardHistory: [...kid.rewardHistory, newGrantEvent] }
            : kid
    ));
  };
  
  const redeemReward = (kidId: string, rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    const kid = kids.find(k => k.id === kidId);
    if (!reward || !kid || kid.points < reward.cost) return;

    const newGrantEvent: GrantedRewardEvent = {
        id: `rh_${Date.now()}`,
        rewardId,
        rewardName: reward.name,
        pointCost: reward.cost,
        date: new Date().toISOString(),
        grantedBy: 'redeemed',
    };

    setKids(prev => prev.map(k =>
        k.id === kidId
            ? { ...k, points: k.points - reward.cost, rewardHistory: [...k.rewardHistory, newGrantEvent] }
            : k
    ));
  };

  return (
    <FamilyDataContext.Provider value={{
      kids,
      behaviors,
      rewards,
      parent: PARENT_USER,
      currentUser,
      setCurrentUser,
      addKid,
      updateKid,
      deleteKid,
      addBehavior,
      deleteBehavior,
      addReward,
      deleteReward,
      assignPoints,
      grantReward,
      redeemReward,
    }}>
      {children}
    </FamilyDataContext.Provider>
  );
};

export const useFamilyData = () => {
  const context = useContext(FamilyDataContext);
  if (context === undefined) {
    throw new Error('useFamilyData must be used within a FamilyDataProvider');
  }
  return context;
};
