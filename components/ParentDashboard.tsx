import React, { useState } from 'react';
import { useFamilyData } from '../contexts/FamilyDataContext';
import ManageKids from './parent/ManageKids';
import ManageBehaviors from './parent/ManageBehaviors';
import ManageRewards from './parent/ManageRewards';
import Reports from './parent/Reports';

type Tab = 'kids' | 'behaviors' | 'rewards' | 'reports';

const ParentDashboard: React.FC = () => {
  const { parent, setCurrentUser } = useFamilyData();
  const [activeTab, setActiveTab] = useState<Tab>('kids');

  const tabs: { key: Tab, label: string }[] = [
    { key: 'kids', label: 'نظرة عامة على الأطفال' },
    { key: 'behaviors', label: 'إدارة السلوكيات' },
    { key: 'rewards', label: 'إدارة المكافآت' },
    { key: 'reports', label: 'التقارير' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'kids': return <ManageKids />;
      case 'behaviors': return <ManageBehaviors />;
      case 'rewards': return <ManageRewards />;
      case 'reports': return <Reports />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">لوحة تحكم ولي الأمر</h1>
            <p className="text-gray-500">مرحباً بك، {parent.name}</p>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shrink-0"
          >
            تسجيل الخروج
          </button>
        </header>

        <nav className="mb-6">
          <div className="border-b border-gray-200">
            <ul className="flex -mb-px text-sm font-medium text-center text-gray-500 overflow-x-auto whitespace-nowrap">
              {tabs.map(tab => (
                <li key={tab.key} className="mr-2">
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'text-brand-primary-600 border-brand-primary-600'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;