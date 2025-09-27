
import React, { useRef, useState } from 'react';
import Modal from './Modal';
import { EMOJI_AVATARS } from '../../lib/emojis';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="اختر صورة رمزية">
      <div>
        <h4 className="font-bold mb-2 text-brand-primary-800">اختر من القائمة</h4>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto bg-brand-light p-2 rounded-md">
          {EMOJI_AVATARS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              className="text-3xl p-2 rounded-full hover:bg-brand-primary-200 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="mt-6">
            <h4 className="font-bold mb-2 text-brand-primary-800">أو حمّل صورة</h4>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-brand-secondary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary-700 transition-colors"
            >
                اختر ملف
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarSelectionModal;
