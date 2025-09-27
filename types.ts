
export interface PointEvent {
  id: string;
  behaviorId: string;
  behaviorName: string;
  points: number;
  date: string; // ISO string
}

export interface GrantedRewardEvent {
  id: string;
  rewardId: string;
  rewardName: string;
  pointCost: number;
  date: string; // ISO string
  grantedBy: 'parent' | 'redeemed';
}

export interface Kid {
  id: string;
  name: string;
  avatar: string; // emoji or data URL
  points: number;
  pointHistory: PointEvent[];
  rewardHistory: GrantedRewardEvent[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Behavior {
  id: string;
  name: string;
  points: number; // can be positive or negative
  icon: string; // emoji
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string; // emoji
  description?: string;
}
