
import React from 'react';
import { FamilyDataProvider, useFamilyData } from './contexts/FamilyDataContext';
import LoginScreen from './components/LoginScreen';
import ParentDashboard from './components/ParentDashboard';
import ChildView from './components/ChildView';

const AppContent: React.FC = () => {
    const { currentUser } = useFamilyData();

    if (!currentUser) {
        return <LoginScreen />;
    }
    
    if (currentUser.id === 'parent') {
        return <ParentDashboard />;
    }
    
    return <ChildView />;
};

const App: React.FC = () => {
  return (
    <FamilyDataProvider>
        <AppContent />
    </FamilyDataProvider>
  );
};

export default App;
