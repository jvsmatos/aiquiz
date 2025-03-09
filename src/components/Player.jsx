import { Save, UserPen } from 'lucide-react';
import { Input } from './ui/input.jsx';
import { useState } from 'react';

export default function Player() {
  const [playerName, setPlayerName] = useState('Player');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className='mx-auto mt-10 dark:text-zinc-200'>
      <div className='flex my-3 gap-3.5'>
        Hello {isEditing ? <Input className='w-20 h-6 text-center' /> : playerName} 
        <UserPen size={20} onClick={() => setIsEditing(true)} />
        <Save size={20} onClick={() => setIsEditing(false)} />
      </div>
      <h2>Welcome to AI Quiz</h2>
      <p>Let's check what you know about:</p>    
    </section>
  );
}