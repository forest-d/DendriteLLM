import React from 'react';
import { useConversationStore } from '../store';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { TreeView } from './TreeView';
import { SplitView } from './SplitView';

function SettingsView() {
  const { apiSettings, updateApiSettings } = useConversationStore();

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Anthropic API Key
              </label>
              <input
                type="password"
                value={apiSettings.anthropicApiKey}
                onChange={(e) => updateApiSettings({ anthropicApiKey: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored locally and never leaves your device.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Model
              </label>
              <select
                value={apiSettings.model}
                onChange={(e) => updateApiSettings({ model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              >
                <optgroup label="Claude 4 (Latest)">
                  <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                  <option value="claude-opus-4-20250514">Claude Opus 4</option>
                </optgroup>
                <optgroup label="Claude 3.7">
                  <option value="claude-3-7-sonnet-20250219">Claude Sonnet 3.7</option>
                </optgroup>
                <optgroup label="Claude 3.5">
                  <option value="claude-3-5-sonnet-20241022">Claude Sonnet 3.5 (New)</option>
                  <option value="claude-3-5-haiku-20241022">Claude Haiku 3.5</option>
                  <option value="claude-3-5-sonnet-20240620">Claude Sonnet 3.5 (Old)</option>
                </optgroup>
                <optgroup label="Claude 3">
                  <option value="claude-3-opus-20240229">Claude Opus 3</option>
                  <option value="claude-3-sonnet-20240229">Claude Sonnet 3</option>
                  <option value="claude-3-haiku-20240307">Claude Haiku 3</option>
                </optgroup>
                <optgroup label="Claude 2 (Legacy)">
                  <option value="claude-2.1">Claude 2.1</option>
                  <option value="claude-2.0">Claude 2.0</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Newer models generally offer better performance and capabilities.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {apiSettings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={apiSettings.temperature}
                onChange={(e) => updateApiSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused (0)</span>
                <span>Creative (1)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                value={apiSettings.maxTokens}
                onChange={(e) => updateApiSettings({ maxTokens: parseInt(e.target.value) })}
                min="1"
                max="8192"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">DendriteLLM Interface</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Transform linear AI conversations into navigable tree structures.
            </p>
            <p className="text-xs text-gray-500 mb-2">
              All conversations are stored locally in your browser. No data is sent to external servers except for API calls to Anthropic.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Supported Models:</strong> Claude 4 (Sonnet/Opus), Claude 3.7, Claude 3.5 (Sonnet/Haiku), Claude 3 (Opus/Sonnet/Haiku), and Claude 2.x
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  const { uiState } = useConversationStore();

  const renderMainContent = () => {
    switch (uiState.currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'tree':
        return <TreeView />;
      case 'split':
        return <SplitView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      {renderMainContent()}
    </div>
  );
}