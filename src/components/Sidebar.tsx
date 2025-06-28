import React, { useState } from 'react';
import { 
  MessageSquare, 
  GitBranch, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3,
  ChevronLeft,
  ChevronRight,
  Columns2
} from 'lucide-react';
import { useConversationStore } from '../store';

export function Sidebar() {
  const [newTreeName, setNewTreeName] = useState('');
  const [isCreatingTree, setIsCreatingTree] = useState(false);
  const [editingTreeId, setEditingTreeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const {
    trees,
    currentTreeId,
    uiState,
    createTree,
    selectTree,
    deleteTree,
    renameTree,
    setCurrentView,
    toggleSidebar,
  } = useConversationStore();

  const handleCreateTree = () => {
    if (!newTreeName.trim()) return;
    
    // Create an empty tree - user will start with their first message
    const treeId = createTree(newTreeName, '', '');
    
    setNewTreeName('');
    setIsCreatingTree(false);
    selectTree(treeId);
  };

  const handleDeleteTree = (treeId: string) => {
    if (confirm('Are you sure you want to delete this conversation tree? This action cannot be undone.')) {
      deleteTree(treeId);
    }
  };

  const handleRenameStart = (treeId: string, currentName: string) => {
    setEditingTreeId(treeId);
    setEditingName(currentName);
  };

  const handleRenameComplete = () => {
    if (editingTreeId && editingName.trim()) {
      renameTree(editingTreeId, editingName.trim());
    }
    setEditingTreeId(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingTreeId(null);
    setEditingName('');
  };

  if (uiState.sidebarCollapsed) {
    return (
      <div className="w-12 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <button
          onClick={toggleSidebar}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="flex-1 flex flex-col items-center space-y-4 py-4">
          <button
            onClick={() => setCurrentView('chat')}
            className={`p-2 rounded-lg transition-colors ${
              uiState.currentView === 'chat'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('tree')}
            className={`p-2 rounded-lg transition-colors ${
              uiState.currentView === 'tree'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <GitBranch className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('split')}
            className={`p-2 rounded-lg transition-colors ${
              uiState.currentView === 'split'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Columns2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className={`p-2 rounded-lg transition-colors ${
              uiState.currentView === 'settings'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">DendriteLLM</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors ${
              uiState.currentView === 'chat'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Chat View"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('tree')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors ${
              uiState.currentView === 'tree'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Tree View"
          >
            <GitBranch className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('split')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors ${
              uiState.currentView === 'split'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Split View"
          >
            <Columns2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors ${
              uiState.currentView === 'settings'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation Trees */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Conversation Trees</h3>
            <button
              onClick={() => setIsCreatingTree(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* New Tree Form */}
          {isCreatingTree && (
            <div className="mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
              <input
                type="text"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                placeholder="Tree name"
                className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateTree()}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateTree}
                  className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingTree(false);
                    setNewTreeName('');
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tree List */}
          <div className="space-y-1">
            {trees.map((tree) => (
              <div
                key={tree.id}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                  currentTreeId === tree.id
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => selectTree(tree.id)}
              >
                {editingTreeId === tree.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full px-1 py-0.5 text-sm bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleRenameComplete();
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                    onBlur={handleRenameComplete}
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{tree.name}</h4>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameStart(tree.id, tree.name);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTree(tree.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {tree.nodes.size} message{tree.nodes.size !== 1 ? 's' : ''} • {tree.branches.length} branch{tree.branches.length !== 1 ? 'es' : ''}
                    </p>
                    {tree.branches.length > 1 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tree.branches.map(branch => (
                          <span
                            key={branch.id}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                              branch.isActive
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <GitBranch className="w-2 h-2 mr-1" />
                            {branch.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {tree.updatedAt instanceof Date ? tree.updatedAt.toLocaleDateString() : new Date(tree.updatedAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {trees.length === 0 && !isCreatingTree && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No conversation trees yet</p>
              <button
                onClick={() => setIsCreatingTree(true)}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
              >
                Create your first tree
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}