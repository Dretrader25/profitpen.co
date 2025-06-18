'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  motivation: string;
  appearance: string;
  backstory: string;
  relationships: string[];
  arcs: string[];
  status: 'main' | 'supporting' | 'minor';
}

interface CharacterManagerProps {
  currentStory: any;
  onTabChange: (tab: string) => void;
}

export default function CharacterManager({ currentStory, onTabChange }: CharacterManagerProps) {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Elena Marquez',
      role: 'Protagonist',
      personality: 'Determined, curious, empathetic but sometimes impulsive',
      motivation: 'To discover the truth about her family\'s mysterious past',
      appearance: 'Tall, dark curly hair, piercing green eyes, small scar on left hand',
      backstory: 'Raised by her grandmother after her parents disappeared when she was young',
      relationships: ['grandmother', 'mentor-kai', 'rival-marcus'],
      arcs: ['discovery', 'growth', 'acceptance'],
      status: 'main'
    },
    {
      id: '2',
      name: 'Kai Thompson',
      role: 'Mentor',
      personality: 'Wise, patient, mysterious, carries hidden knowledge',
      motivation: 'To guide Elena while protecting ancient secrets',
      appearance: 'Middle-aged, graying beard, weathered hands, kind eyes',
      backstory: 'Former guardian of the ancient order, knew Elena\'s parents',
      relationships: ['student-elena', 'old-friend-grandmother'],
      arcs: ['revelation', 'sacrifice'],
      status: 'supporting'
    }
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: '',
    role: '',
    personality: '',
    motivation: '',
    appearance: '',
    backstory: '',
    relationships: [],
    arcs: [],
    status: 'supporting'
  });

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter({ ...character });
    setIsEditing(true);
  };

  const handleSaveCharacter = () => {
    if (editingCharacter) {
      setCharacters(prev => 
        prev.map(ch => ch.id === editingCharacter.id ? editingCharacter : ch)
      );
      setIsEditing(false);
      setEditingCharacter(null);
    }
  };

  const handleCreateCharacter = () => {
    if (newCharacter.name && newCharacter.role) {
      const character: Character = {
        id: Date.now().toString(),
        name: newCharacter.name!,
        role: newCharacter.role!,
        personality: newCharacter.personality || '',
        motivation: newCharacter.motivation || '',
        appearance: newCharacter.appearance || '',
        backstory: newCharacter.backstory || '',
        relationships: newCharacter.relationships || [],
        arcs: newCharacter.arcs || [],
        status: newCharacter.status as 'main' | 'supporting' | 'minor' || 'supporting'
      };
      
      setCharacters(prev => [...prev, character]);
      setNewCharacter({
        name: '',
        role: '',
        personality: '',
        motivation: '',
        appearance: '',
        backstory: '',
        relationships: [],
        arcs: [],
        status: 'supporting'
      });
      setShowCreateModal(false);
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      setCharacters(prev => prev.filter(ch => ch.id !== characterId));
      if (selectedCharacter === characterId) {
        setSelectedCharacter(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'main': return 'bg-purple-100 text-purple-800';
      case 'supporting': return 'bg-blue-100 text-blue-800';
      case 'minor': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'main': return '⭐';
      case 'supporting': return '🎭';
      case 'minor': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="h-full flex">
      {/* Characters List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Contacts ({characters.length}) {/* Changed */}
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              + New Contact {/* Changed */}
            </button>
          </div>
          
          {/* Contact Stats by Role */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-semibold text-purple-600">
                {characters.filter(c => c.status === 'main').length} {/* Status 'main' could map to 'Owner' */}
              </div>
              <div className="text-purple-600">Owners</div> {/* Changed */}
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">
                {characters.filter(c => c.status === 'supporting').length} {/* Status 'supporting' could map to 'Buyer' */}
              </div>
              <div className="text-blue-600">Buyers</div> {/* Changed */}
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-600">
                {characters.filter(c => c.status === 'minor').length} {/* Status 'minor' could map to 'Agent' or 'Tenant' */}
              </div>
              <div className="text-gray-600">Agents</div> {/* Changed example */}
            </div>
          </div>
        </div>

        {/* Characters List */}
        <div className="overflow-y-auto h-full">
          <div className="p-4 space-y-3">
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCharacter === character.id
                    ? 'bg-purple-50 border-purple-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(character.status)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {character.name} {/* Contact Name */}
                      </h3>
                      <p className="text-xs text-gray-600">{character.role}</p> {/* Role (e.g., Owner, Buyer, Agent) */}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(character.status)}`}>
                    {character.status} {/* Status like Owner, Buyer, Agent */}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {character.personality} {/* This could map to "Notes" or "Key Details" */}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{character.relationships.length} Associated Properties</span> {/* Changed */}
                  <span>{character.arcs.length} Interactions</span> {/* Changed */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Character Details */}
      <div className="flex-1 flex flex-col">
        {selectedCharacter ? (
          <>
            {(() => {
              const character = characters.find(ch => ch.id === selectedCharacter);
              if (!character) return null;
              
              return (
                <>
                  {/* Character Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getStatusIcon(character.status)}</span> {/* Icon might need update based on new roles */}
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {character.name} {/* Contact Name */}
                          </h2>
                          <p className="text-sm text-gray-600">{character.role}</p> {/* Role (e.g., Owner, Buyer, Agent) */}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(character.status)}`}>
                          {character.status} {/* Status like Owner, Buyer, Agent */}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCharacter(character)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Contact {/* Changed */}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCharacter(character.id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Contact {/* Changed */}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Character Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-6">
                        {/* Map Personality, Motivation, Appearance, Backstory to more generic "Notes" or specific contact fields */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>📝</span> Notes / Key Details
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {character.personality || 'No details provided.'} {/* Combining personality as an example */}
                          </p>
                        </div>
                         <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>📞</span> Contact Information
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Email: {character.motivation || 'N/A'} {/* Motivation mapped to Email example */} <br/>
                            Phone: {character.appearance || 'N/A'} {/* Appearance mapped to Phone example */}
                          </p>
                        </div>
                         <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>🏠</span> Mailing Address
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {character.backstory || 'No address provided.'} {/* Backstory mapped to Address example */}
                          </p>
                        </div>
                      </div>

                      {/* Advanced Info */}
                      <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>🏘️</span> Associated Properties
                          </h3>
                          <div className="space-y-2">
                            {character.relationships.length > 0 ? (
                              character.relationships.map((rel, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2 mb-2"
                                >
                                  {rel} {/* This would be property IDs or addresses */}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No associated properties.</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>🔄</span> Interaction History
                          </h3>
                          <div className="space-y-2">
                            {character.arcs.length > 0 ? (
                              character.arcs.map((arc, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mr-2 mb-2"
                                >
                                  {arc} {/* This would be interaction summaries/dates */}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No interaction history recorded.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Contact</h3> {/* Changed */}
              <p className="text-gray-600 mb-4">Choose a contact from the list to view and edit their details</p> {/* Changed */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create New Contact {/* Changed */}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Contact: {editingCharacter.name} {/* Changed */}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingCharacter.name}
                      onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={editingCharacter.role}
                      onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, role: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingCharacter.status}
                    onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="main">Owner</option> {/* Changed */}
                    <option value="supporting">Buyer</option> {/* Changed */}
                    <option value="minor">Agent</option> {/* Changed */}
                    <option value="tenant">Tenant</option> {/* Added Example */}
                  </select>
                </div>
                {/* The following fields (Personality, Motivation, Backstory) will be re-purposed or removed.
                    For now, changing labels to generic "Notes" or specific contact fields.
                */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Key Details</label>
                  <textarea
                    value={editingCharacter.personality} // Re-using 'personality' state field for 'Notes'
                    onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, personality: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="E.g., Interested in multi-family, budget $500k, pre-approved."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingCharacter.motivation} // Re-using 'motivation' state field for 'Phone'
                    onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, motivation: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
                  <textarea
                    value={editingCharacter.backstory} // Re-using 'backstory' state field for 'Mailing Address'
                    onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, backstory: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 123 Property Ln, Anytown, USA 12345"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingCharacter(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCharacter}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Contact</h3> {/* Changed */}
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newCharacter.name || ''}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Contact name" // Changed
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <input
                      type="text"
                      value={newCharacter.role || ''}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Owner, Buyer, Agent" // Changed
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status/Category</label> {/* Changed */}
                  <select
                    value={newCharacter.status || 'supporting'} // 'supporting' could map to 'Buyer'
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="main">Owner</option> {/* Changed */}
                    <option value="supporting">Buyer</option> {/* Changed */}
                    <option value="minor">Agent</option> {/* Changed */}
                    <option value="tenant">Tenant</option> {/* Added Example */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label> {/* Changed */}
                  <textarea
                    value={newCharacter.personality || ''} // Re-using 'personality' state field
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, personality: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter any relevant notes about this contact..." // Changed
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCharacter({
                      name: '',
                      role: '',
                      personality: '',
                      motivation: '',
                      appearance: '',
                      backstory: '',
                      relationships: [],
                      arcs: [],
                      status: 'supporting'
                    });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCharacter}
                  disabled={!newCharacter.name || !newCharacter.role}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Contact {/* Changed */}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
