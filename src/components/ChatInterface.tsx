import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, GitBranch, Plus, TreePine } from 'lucide-react';
import { useConversationStore } from '../store';
import { ConversationNode } from '../types';

interface MessageBubbleProps {
  node: ConversationNode;
  isLast: boolean;
  onCreateBranch: (nodeId: string) => void;
  onNavigateToTree: (nodeId: string) => void;
}

function MessageBubble({ node, isLast, onCreateBranch, onNavigateToTree }: MessageBubbleProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-lg px-4 py-2 relative group">
          <p className="whitespace-pre-wrap">{node.userMessage}</p>
          
          <button
            onClick={() => onNavigateToTree(node.id)}
            className="absolute -left-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-1 shadow-sm hover:shadow-md"
            title="View this message in tree"
          >
            <TreePine className="w-3 h-3 text-blue-600" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-start">
        <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 relative group">
          <p className="whitespace-pre-wrap">{node.aiResponse}</p>
          
          <button
            onClick={() => onNavigateToTree(node.id)}
            className="absolute -left-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-1 shadow-sm hover:shadow-md"
            title="View this message in tree"
          >
            <TreePine className="w-3 h-3 text-gray-600" />
          </button>
          
          <button
            onClick={() => onCreateBranch(node.id)}
            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-1 shadow-sm hover:shadow-md"
            title="Create branch from here"
          >
            <GitBranch className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchFromNodeId, setBranchFromNodeId] = useState<string | null>(null);
  const [branchName, setBranchName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    getCurrentPath,
    addMessage,
    setCreatingBranch,
    apiSettings,
    getCurrentTree,
    createBranch,
    navigateToNode,
    selectBranch,
    setCurrentView,
    setSelectedNode,
    uiState,
  } = useConversationStore();

  const conversationPath = getCurrentPath();
  const currentTree = getCurrentTree();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationPath]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!apiSettings.anthropicApiKey) {
      alert('Please set your Anthropic API key in settings first.');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      if (!apiSettings.anthropicApiKey) {
        throw new Error('No API key configured');
      }
      
      const response = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiSettings.anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: apiSettings.model,
          max_tokens: apiSettings.maxTokens,
          temperature: apiSettings.temperature,
          messages: [
            ...conversationPath.flatMap(node => [
              { role: 'user', content: node.userMessage },
              { role: 'assistant', content: node.aiResponse },
            ]),
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      addMessage(userMessage, aiResponse);
    } catch (error) {
      console.error('Error calling Claude API:', error);
      alert('Failed to get response from Claude. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateBranch = (nodeId: string) => {
    setBranchFromNodeId(nodeId);
    setShowBranchModal(true);
  };

  const handleBranchSubmit = () => {
    if (!branchFromNodeId || !branchName.trim()) return;
    
    createBranch(branchFromNodeId, branchName.trim());
    navigateToNode(branchFromNodeId);
    
    setShowBranchModal(false);
    setBranchFromNodeId(null);
    setBranchName('');
  };

  const handleBranchCancel = () => {
    setShowBranchModal(false);
    setBranchFromNodeId(null);
    setBranchName('');
  };

  const handleBranchSwitch = (branchId: string) => {
    selectBranch(branchId);
  };

  const handleNavigateToTree = (nodeId: string) => {
    if (!currentTree) return;
    
    const node = currentTree.nodes.get(nodeId);
    if (node && node.branchId) {
      const branch = currentTree.branches.find(b => b.id === node.branchId);
      if (branch && !branch.isActive) {
        selectBranch(branch.id);
      }
    }
    
    navigateToNode(nodeId);
    setSelectedNode(nodeId);
    
    if (uiState.currentView !== 'split') {
      setCurrentView('tree');
    }
  };

  if (!currentTree) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Conversation Selected
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            Start a new conversation to begin exploring ideas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{currentTree.name}</h1>
            <p className="text-sm text-gray-500">
              {conversationPath.length} message{conversationPath.length !== 1 ? 's' : ''} in this path
            </p>
          </div>
          
          {/* Branch Selector */}
          {currentTree.branches.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Branch:</span>
              <select
                value={currentTree.branches.find(b => b.isActive)?.id || 'main'}
                onChange={(e) => handleBranchSwitch(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                {currentTree.branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Current Branch Name (when only one branch) */}
        {currentTree.branches.length === 1 && (
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <GitBranch className="w-3 h-3 mr-1" />
              {currentTree.branches[0].name}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversationPath.map((node, index) => (
          <MessageBubble
            key={node.id}
            node={node}
            isLast={index === conversationPath.length - 1}
            onCreateBranch={handleCreateBranch}
            onNavigateToTree={handleNavigateToTree}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            rows={Math.min(Math.max(1, inputMessage.split('\n').length), 4)}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {!isLoading && <span>Send</span>}
          </button>
        </div>
      </div>

      {/* Floating Branch Button */}
      {conversationPath.length > 0 && (
        <button
          onClick={() => handleCreateBranch(currentTree.currentNodeId)}
          className="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center space-x-2 group"
          title="Create branch from current message"
        >
          <GitBranch className="w-5 h-5" />
          <span className="hidden group-hover:block text-sm font-medium pr-1">Branch</span>
        </button>
      )}

      {/* Branch Creation Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Branch</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && handleBranchSubmit()}
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBranchSubmit}
                disabled={!branchName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Branch
              </button>
              <button
                onClick={handleBranchCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              This will create a new conversation path from the current message, allowing you to explore different discussion directions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}