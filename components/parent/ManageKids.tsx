
import React, { useState } from 'react';
import { useFamilyData } from '../../contexts/FamilyDataContext';
import Avatar from '../shared/Avatar';
import Modal from '../shared/Modal';
import AvatarSelectionModal from '../shared/AvatarSelectionModal';
import { Kid } from '../../types';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
);

const KidFormModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    kidToEdit: Kid | null
}> = ({ isOpen, onClose, kidToEdit }) => {
    const { addKid, updateKid } = useFamilyData();
    const [name, setName] = useState(kidToEdit?.name || '');
    const [avatar, setAvatar] = useState(kidToEdit?.avatar || '😀');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    React.useEffect(() => {
        if(kidToEdit) {
            setName(kidToEdit.name);
            setAvatar(kidToEdit.avatar);
        } else {
            setName('');
            setAvatar('😀');
        }
    }, [kidToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') return;
        if(kidToEdit) {
            updateKid(kidToEdit.id, name, avatar);
        } else {
            addKid(name, avatar);
        }
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={kidToEdit ? 'تعديل الطفل' : 'إضافة طفل جديد'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center">
                        <Avatar src={avatar} size="lg" />
                        <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="text-sm text-brand-primary-600 hover:underline mt-2">
                            تغيير الصورة
                        </button>
                    </div>
                    <div>
                        <label htmlFor="kid-name" className="block text-sm font-medium text-gray-900">الاسم</label>
                        <input
                            type="text"
                            id="kid-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white text-brand-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary-500 focus:border-brand-primary-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary-600 text-white rounded-md hover:bg-brand-primary-700">
                            {kidToEdit ? 'حفظ التغييرات' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </Modal>
            <AvatarSelectionModal 
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelect={setAvatar}
            />
        </>
    );
}

const AssignPointsModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    kid: Kid
}> = ({ isOpen, onClose, kid }) => {
    const { behaviors, assignPoints } = useFamilyData();

    const handleAssign = (behaviorId: string) => {
        assignPoints(kid.id, behaviorId);
        onClose();
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`إسناد نقاط إلى ${kid.name}`}>
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {behaviors.map(behavior => (
                    <div key={behavior.id} onClick={() => handleAssign(behavior.id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${behavior.points > 0 ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`}>
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">{behavior.icon}</span>
                            <span className="font-medium">{behavior.name}</span>
                        </div>
                        <span className={`font-bold text-lg ${behavior.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {behavior.points > 0 ? '+' : ''}{behavior.points}
                        </span>
                    </div>
                ))}
            </div>
        </Modal>
    );
};


const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    kidName: string;
}> = ({ isOpen, onClose, onConfirm, kidName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تأكيد الحذف">
            <p>هل أنت متأكد أنك تريد حذف الطفل "{kidName}"؟ سيتم حذف جميع نقاطه وتاريخه بشكل دائم.</p>
            <div className="flex justify-end space-x-2 space-x-reverse mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">نعم، احذف</button>
            </div>
        </Modal>
    );
};


const ManageKids: React.FC = () => {
  const { kids, deleteKid } = useFamilyData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [kidToEdit, setKidToEdit] = useState<Kid | null>(null);
  const [kidToAssign, setKidToAssign] = useState<Kid | null>(null);
  const [kidToDelete, setKidToDelete] = useState<Kid | null>(null);

  const handleEdit = (kid: Kid) => {
      setKidToEdit(kid);
      setIsAddModalOpen(true);
  }

  const handleOpenAdd = () => {
    setKidToEdit(null);
    setIsAddModalOpen(true);
  }
  
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setKidToEdit(null);
  }
  
  const handleDelete = (kid: Kid) => {
    setKidToDelete(kid);
  }
  
  const confirmDelete = () => {
      if(kidToDelete) {
          deleteKid(kidToDelete.id);
          setKidToDelete(null);
      }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {kids.map((kid) => (
        <div key={kid.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative">
            <div className="absolute top-2 right-2 flex space-x-1 space-x-reverse">
                <button onClick={() => handleEdit(kid)} className="text-gray-400 hover:text-brand-primary-600 p-1 rounded-full"><EditIcon /></button>
                <button onClick={() => handleDelete(kid)} className="text-gray-400 hover:text-red-600 p-1 rounded-full"><DeleteIcon /></button>
            </div>
          <Avatar src={kid.avatar} size="lg" className="mb-3" />
          <h3 className="text-xl font-bold text-brand-dark">{kid.name}</h3>
          <p className="text-3xl font-black text-brand-accent-600 my-2">{kid.points}</p>
          <button onClick={() => setKidToAssign(kid)} className="w-full mt-2 bg-brand-secondary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary-600 transition-colors">
            إسناد نقاط
          </button>
        </div>
      ))}
      <div 
        onClick={handleOpenAdd}
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-colors min-h-[240px]"
      >
        <span className="text-5xl text-gray-400">+</span>
        <span className="mt-2 text-lg font-bold text-gray-600">إضافة طفل</span>
      </div>
      
      <KidFormModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        kidToEdit={kidToEdit}
      />

      {kidToAssign && <AssignPointsModal 
        isOpen={!!kidToAssign}
        onClose={() => setKidToAssign(null)}
        kid={kidToAssign}
      />}

      {kidToDelete && <DeleteConfirmationModal 
        isOpen={!!kidToDelete}
        onClose={() => setKidToDelete(null)}
        onConfirm={confirmDelete}
        kidName={kidToDelete.name}
      />}
    </div>
  );
};

export default ManageKids;
