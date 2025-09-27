
import React, { useState } from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';
import { getBehaviorSuggestions, getEmojiSuggestions } from '../../services/geminiService';

const ManageBehaviors: React.FC = () => {
  const { behaviors, addBehavior, deleteBehavior } = useFamilyData();
  const [name, setName] = useState('');
  const [points, setPoints] = useState<number | ''>('');
  const [icon, setIcon] = useState('😊');
  const [loading, setLoading] = useState(false);
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && points !== '') {
      addBehavior(name, Number(points), icon);
      setName('');
      setPoints('');
      setIcon('😊');
      setEmojiSuggestions([]);
    }
  };

  const handleAISuggestions = async (type: 'good' | 'chore') => {
    setLoading(true);
    const suggestions = await getBehaviorSuggestions(type);
    if(suggestions && suggestions.length > 0) {
        // use the first suggestion
        const suggestion = suggestions[0];
        setName(suggestion.name);
        setPoints(suggestion.points);
    }
    setLoading(false);
  };
  
  const handleEmojiSuggest = async () => {
      if(!name) return;
      setLoading(true);
      const suggestions = await getEmojiSuggestions(name);
      if(suggestions && suggestions.length > 0) {
          setEmojiSuggestions(suggestions);
          setIcon(suggestions[0]); // auto-select first one
      }
      setLoading(false);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-brand-dark">إضافة سلوك جديد</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">اسم السلوك</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">النقاط</label>
              <input type="number" value={points} onChange={(e) => setPoints(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 text-brand-dark" required/>
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
            <button type="submit" className="w-full bg-brand-primary-600 text-white font-bold py-2 rounded-md hover:bg-brand-primary-700">إضافة</button>
          </form>
          <div className="mt-4 pt-4 border-t space-y-2">
            <h4 className="font-semibold text-brand-dark">بحاجة لإلهام؟</h4>
            <button onClick={() => handleAISuggestions('good')} disabled={loading} className="w-full text-sm py-2 px-3 bg-brand-secondary-100 text-brand-secondary-800 rounded-md hover:bg-brand-secondary-200 disabled:opacity-50">
                {loading ? 'جاري التحميل...' : '💡 اقتراح عادات جيدة'}
            </button>
            <button onClick={() => handleAISuggestions('chore')} disabled={loading} className="w-full text-sm py-2 px-3 bg-brand-secondary-100 text-brand-secondary-800 rounded-md hover:bg-brand-secondary-200 disabled:opacity-50">
                {loading ? 'جاري التحميل...' : '🧹 اقتراح مهام منزلية'}
            </button>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-brand-dark">السلوكيات الحالية</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {behaviors.map(b => (
                    <div key={b.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-3xl mr-4">{b.icon}</span>
                            <span className="font-medium text-brand-dark">{b.name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className={`font-bold text-lg mr-4 ${b.points > 0 ? 'text-green-600' : 'text-red-600'}`}>{b.points > 0 ? '+' : ''}{b.points}</span>
                            <button onClick={() => deleteBehavior(b.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ManageBehaviors;
