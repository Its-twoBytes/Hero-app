import React, { useState, useEffect } from 'react';
import { useFamilyData } from '../contexts/FamilyDataContext';
import Avatar from './shared/Avatar';
import Modal from './shared/Modal';

const WelcomeModal: React.FC<{onClose: () => void}> = ({onClose}) => (
    <Modal isOpen={true} onClose={onClose} title="أهلاً بكم في تطبيق بطل!">
        <div className="space-y-5 text-right">
            <p className="text-gray-700 leading-relaxed">
                "بطل" هو تطبيق لمساعدة العائلات على تشجيع السلوكيات الإيجابية بطريقة ممتعة ومحفزة.
            </p>
            
            <div>
                <h4 className="font-bold text-brand-dark mb-2">كيف يعمل التطبيق؟</h4>
                <ul className="list-disc list-inside space-y-3 pr-4 text-gray-600">
                    <li>
                        <strong>لأولياء الأمور:</strong><br/> يمكنكم إضافة نقاط للسلوكيات الجيدة أو خصمها، وإدارة المكافآت للأبطال الصغار.
                    </li>
                    <li>
                        <strong>للأطفال الأبطال:</strong><br/> يمكنكم متابعة نقاطكم، مشاهدة تقدمكم، واستبدالها بمكافآت رائعة.
                    </li>
                </ul>
            </div>

            <div className="pt-4">
                 <button
                    onClick={onClose}
                    className="w-full bg-brand-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                    هيا نبدأ رحلة الأبطال!
                </button>
            </div>
        </div>
    </Modal>
);

const LoginScreen: React.FC = () => {
  const { kids, parent, setCurrentUser } = useFamilyData();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBatalApp');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedBatalApp', 'true');
    }
  }, []);

  const handleCloseWelcome = () => setShowWelcome(false);

  return (
    <div className="min-h-screen bg-brand-primary-50 flex flex-col items-center justify-center p-4 sm:p-8" style={{ fontFamily: "'Cairo', sans-serif" }}>
       {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}

      <h1 className="text-5xl sm:text-6xl font-black text-brand-primary-700 mb-2 text-center">بَـطَـل</h1>
      <p className="text-lg sm:text-xl text-brand-dark mb-8 text-center">من يود استخدام التطبيق؟</p>

      <div className="w-full max-w-4xl space-y-8">
        {/* Parent Card */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => setCurrentUser(parent)}
        >
          <Avatar src={parent.avatar} size="lg" className="mb-4 border-4 border-brand-accent-400" />
          <h2 className="text-2xl font-bold text-brand-dark">{parent.name}</h2>
        </div>
        
        {/* Kids Cards */}
        {kids.length > 0 && (
            <>
                <div className="relative text-center">
                    <hr className="border-gray-300"/>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary-50 px-4 text-gray-500 font-medium">الأطفال</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {kids.map((kid) => (
                        <div 
                            key={kid.id}
                            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() => setCurrentUser({id: kid.id, name: kid.name, avatar: kid.avatar})}
                        >
                            <Avatar src={kid.avatar} size="lg" className="mb-4 border-4 border-brand-secondary-400" />
                            <h2 className="text-2xl font-bold text-brand-dark">{kid.name}</h2>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;