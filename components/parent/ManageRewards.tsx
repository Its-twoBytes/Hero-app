import React, { useState } from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';
import { getRewardSuggestions, getEmojiSuggestions } from '../../services/geminiService';
import { Reward } from '../../types';

const ManageRewards: React.FC = () => {
  const { rewards, addReward, deleteReward, kids, grantReward } = useFamilyData();
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [icon, setIcon] = useState('🎁');
  const [loading, setLoading] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string>('');
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Omit<Reward, 'id'|'icon'>[]>([]);

  const selectedKid = kids.find(k => k.id === selectedKidId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && cost !== '' && Number(cost) > 0) {
      addReward(name, Number(cost), icon);
      setName('');
      setCost('');
      setIcon('🎁');
      setEmojiSuggestions([]);
    }
  };

  const handleAISuggestions = async () => {
    setLoading(true);
    setAiSuggestions([]);
    const suggestions = await getRewardSuggestions(kids.map(k => k.name).join(', '));
    if (suggestions) {
      setAiSuggestions(suggestions);
    }
    setLoading(false);
  };

  const handleEmojiSuggest = async () => {
    if (!name) return;
    setLoading(true);
    const suggestions = await getEmojiSuggestions(name);
    if (suggestions && suggestions.length > 0) {
      setEmojiSuggestions(suggestions);
      setIcon(suggestions[0]);
    }
    setLoading(false);
  };
  
  const handleAddAiSuggestion = (suggestion: Omit<Reward, 'id'|'icon'>) => {
      addReward(suggestion.name, suggestion.cost, '⭐', suggestion.description);
      setAiSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4 text-brand-dark">إضافة مكافأة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">اسم المكافأة</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">التكلفة (نقاط)</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark" required min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">الأيقونة</label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="mt-1 w-20 text-center p-2 text-2xl bg-white border border-gray-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark" maxLength={2} />
                  <button type="button" onClick={handleEmojiSuggest} disabled={!name || loading} className="px-3 py-2 text-sm bg-brand-accent-500 text-white rounded-md hover:bg-brand-accent-600 disabled:bg-gray-300">
                    {loading ? '...' : 'اقترح'}
                  </button>
                </div>
                 {emojiSuggestions.length > 0 && (
                  <div className="flex space-x-1 space-x-reverse mt-2">
                      {emojiSuggestions.map(s => (
                          <button key={s} type="button" onClick={() => setIcon(s)} className={`p-1 text-2xl rounded-full ${icon === s ? 'bg-brand-primary-200' : 'hover:bg-gray-200'}`}>{s}</button>
                      ))}
                  </div>
              )}
              </div>
              <button type="submit" className="w-full bg-brand-primary-600 text-white font-bold py-2 rounded-md hover:bg-brand-primary-700">إضافة مكافأة</button>
            </form>
          </div>
          <div className="pt-6 border-t">
            <h3 className="text-xl font-bold mb-4 text-brand-dark">بحاجة لإلهام؟</h3>
            <button onClick={handleAISuggestions} disabled={loading} className="w-full flex items-center justify-center font-bold py-2.5 px-4 bg-brand-accent-500 text-white rounded-lg hover:bg-brand-accent-600 disabled:bg-brand-accent-300 transition-colors shadow-md hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 10.607a1 1 0 011.414 0l.707-.707a1 1 0 11-1.414-1.414l-.707.707zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                </svg>
                <span className="text-sm">
                    {loading ? 'جاري التحميل...' : 'اقتراح مكافآت بالذكاء الاصطناعي'}
                </span>
            </button>
            {aiSuggestions.length > 0 && (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-gray-600">اقتراحات لك:</h4>
                    {aiSuggestions.map((s, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded-md flex justify-between items-start">
                           <div>
                             <p className="font-bold">{s.name}</p>
                             <p className="text-xs text-gray-500">{s.description}</p>
                             <p className="text-sm font-semibold text-brand-accent-700">{s.cost} نقطة</p>
                           </div>
                           <button onClick={() => handleAddAiSuggestion(s)} className="text-sm bg-brand-secondary-500 text-white rounded-md px-2 py-1 hover:bg-brand-secondary-600 shrink-0 mr-2">إضافة</button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <h3 className="text-xl font-bold text-brand-dark shrink-0">المكافآت الحالية ومنحها</h3>
            <div className="w-full sm:w-48">
                 <label htmlFor="kid-progress-select" className="block text-sm font-medium text-gray-900 mb-1">عرض تقدم الطفل</label>
                 <select id="kid-progress-select" value={selectedKidId} onChange={e => setSelectedKidId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark text-sm">
                    <option value="">-- اختر طفل --</option>
                    {kids.map(kid => <option key={kid.id} value={kid.id}>{kid.name}</option>)}
                </select>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {rewards.map(r => {
                const progress = selectedKid ? Math.min((selectedKid.points / r.cost) * 100, 100) : 0;
                return (
                    <div key={r.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="text-3xl ml-4">{r.icon}</span>
                                <div>
                                    <span className="font-medium text-brand-dark">{r.name}</span>
                                    <p className="font-bold text-sm text-brand-accent-600">{r.cost} نقطة</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {selectedKid && (
                                     <button onClick={() => grantReward(selectedKid.id, r.id)} className="bg-brand-secondary-500 text-white text-sm font-bold py-1 px-3 rounded-md hover:bg-brand-secondary-600 ml-4">
                                        منح
                                    </button>
                                )}
                                <button onClick={() => deleteReward(r.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                        {selectedKid && (
                             <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>تقدم {selectedKid.name}: {selectedKid.points} / {r.cost}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-brand-accent-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRewards;