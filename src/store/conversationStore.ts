import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConversationTree, ConversationNode, AppState, UIState, APISettings } from '../types';
import { 
  generateTreeId, 
  createRootNode, 
  addNodeToTree, 
  createBranchFromNode,
  getPathToNode,
  createStarCraftDemoTree
} from '../utils';

interface ConversationStore extends AppState {
  // Tree management
  createTree: (name: string, initialUserMessage: string, initialAiResponse: string) => string;
  selectTree: (treeId: string) => void;
  deleteTree: (treeId: string) => void;
  renameTree: (treeId: string, newName: string) => void;
  
  // Node management
  addMessage: (userMessage: string, aiResponse: string) => string | null;
  navigateToNode: (nodeId: string) => void;
  
  // Branch management
  createBranch: (nodeId: string, branchName: string) => void;
  selectBranch: (branchId: string) => void;
  switchBranchOnly: (branchId: string) => void;
  
  // UI state
  setCurrentView: (view: 'chat' | 'tree' | 'settings') => void;
  toggleSidebar: () => void;
  setTreeViewport: (x: number, y: number, zoom: number) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setCreatingBranch: (creating: boolean) => void;
  saveNodePositions: (nodePositions: Map<string, { x: number; y: number }>) => void;
  
  // API settings
  updateApiSettings: (settings: Partial<APISettings>) => void;
  
  // Getters
  getCurrentTree: () => ConversationTree | null;
  getCurrentPath: () => ConversationNode[];
  getConversationHistory: () => { role: 'user' | 'assistant'; content: string }[];
}

const initialUIState: UIState = {
  currentView: 'chat',
  sidebarCollapsed: false,
  treeViewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  isCreatingBranch: false,
};

const initialAPISettings: APISettings = {
  anthropicApiKey: '',
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 4000,
};


const serializeTree = (tree: ConversationTree) => ({
  ...tree,
  nodes: Object.fromEntries(tree.nodes.entries()),
  nodePositions: tree.nodePositions ? Object.fromEntries(tree.nodePositions.entries()) : undefined,
});
const deserializeTree = (tree: any): ConversationTree => {
  const nodes = new Map();
  
  Object.entries(tree.nodes).forEach(([id, node]: [string, any]) => {
    nodes.set(id, {
      ...node,
      timestamp: new Date(node.timestamp),
      metadata: {
        ...node.metadata,
        timestamp: new Date(node.metadata.timestamp),
      },
    });
  });

  let nodePositions;
  if (tree.nodePositions) {
    nodePositions = new Map();
    Object.entries(tree.nodePositions).forEach(([id, position]: [string, any]) => {
      nodePositions.set(id, position);
    });
  }

  return {
    ...tree,
    nodes,
    nodePositions,
    createdAt: new Date(tree.createdAt),
    updatedAt: new Date(tree.updatedAt),
  };
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => {
      const initialTrees = [];
      let initialCurrentTreeId = null;
      
      try {
        const persistedData = localStorage.getItem('conversation-store');
        if (!persistedData) {
          const demoTree = createStarCraftDemoTree();
          initialTrees.push(demoTree);
          initialCurrentTreeId = demoTree.id;
        }
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
      }

      return {
        trees: initialTrees,
        currentTreeId: initialCurrentTreeId,
        uiState: initialUIState,
        apiSettings: initialAPISettings,

        createTree: (name: string, initialUserMessage: string, initialAiResponse: string) => {
        const treeId = generateTreeId();
        
        if (!initialUserMessage.trim() || !initialAiResponse.trim()) {
          const newTree: ConversationTree = {
            id: treeId,
            name,
            rootId: '',
            nodes: new Map(),
            currentNodeId: '',
            branches: [{
              id: 'main',
              name: 'Main',
              rootNodeId: '',
              leafNodeId: '',
              isActive: true,
            }],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set(state => ({
            trees: [...state.trees, newTree],
            currentTreeId: treeId,
          }));

          return treeId;
        }

        const rootNode = createRootNode(initialUserMessage, initialAiResponse, 'main');
        
        const newTree: ConversationTree = {
          id: treeId,
          name,
          rootId: rootNode.id,
          nodes: new Map([[rootNode.id, rootNode]]),
          currentNodeId: rootNode.id,
          branches: [{
            id: 'main',
            name: 'Main',
            rootNodeId: rootNode.id,
            leafNodeId: rootNode.id,
            isActive: true,
          }],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          trees: [...state.trees, newTree],
          currentTreeId: treeId,
        }));

        return treeId;
      },

      selectTree: (treeId: string) => {
        set({ currentTreeId: treeId });
      },

      deleteTree: (treeId: string) => {
        set(state => ({
          trees: state.trees.filter(tree => tree.id !== treeId),
          currentTreeId: state.currentTreeId === treeId ? null : state.currentTreeId,
        }));
      },

      renameTree: (treeId: string, newName: string) => {
        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === treeId 
              ? { ...tree, name: newName, updatedAt: new Date() }
              : tree
          ),
        }));
      },

      addMessage: (userMessage: string, aiResponse: string) => {
        const { currentTreeId, trees } = get();
        if (!currentTreeId) return null;

        const currentTree = trees.find(tree => tree.id === currentTreeId);
        if (!currentTree) return null;

        if (currentTree.nodes.size === 0) {
          const activeBranch = currentTree.branches.find(b => b.isActive) || currentTree.branches[0];
          const rootNode = createRootNode(userMessage, aiResponse, activeBranch.id);
          
          const updatedTree: ConversationTree = {
            ...currentTree,
            rootId: rootNode.id,
            nodes: new Map([[rootNode.id, rootNode]]),
            currentNodeId: rootNode.id,
            branches: currentTree.branches.map(branch => ({
              ...branch,
              rootNodeId: rootNode.id,
              leafNodeId: rootNode.id,
            })),
            updatedAt: new Date(),
          };

          set(state => ({
            trees: state.trees.map(tree => 
              tree.id === currentTreeId ? updatedTree : tree
            ),
          }));

          return rootNode.id;
        }

        const activeBranch = currentTree.branches.find(b => b.isActive) || currentTree.branches[0];
        const { tree: updatedTree, nodeId } = addNodeToTree(
          currentTree,
          currentTree.currentNodeId,
          userMessage,
          aiResponse,
          activeBranch.id
        );

        const updatedActiveBranch = updatedTree.branches.find(b => b.isActive);
        const finalTree = updatedActiveBranch ? {
          ...updatedTree,
          branches: updatedTree.branches.map(branch => 
            branch.isActive 
              ? { ...branch, leafNodeId: nodeId }
              : branch
          ),
        } : updatedTree;

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId ? finalTree : tree
          ),
        }));

        return nodeId;
      },

      navigateToNode: (nodeId: string) => {
        const { currentTreeId, trees } = get();
        if (!currentTreeId) return;

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId 
              ? { ...tree, currentNodeId: nodeId, updatedAt: new Date() }
              : tree
          ),
        }));
      },

      createBranch: (nodeId: string, branchName: string) => {
        const { currentTreeId, trees } = get();
        if (!currentTreeId) return;

        const currentTree = trees.find(tree => tree.id === currentTreeId);
        if (!currentTree) return;

        const { tree: updatedTree, branch } = createBranchFromNode(currentTree, nodeId, branchName);
        
        const finalTree = {
          ...updatedTree,
          branches: updatedTree.branches.map(b => ({
            ...b,
            isActive: b.id === branch.id,
          })),
          currentNodeId: nodeId,
        };

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId ? finalTree : tree
          ),
        }));
      },

      selectBranch: (branchId: string) => {
        const { currentTreeId } = get();
        if (!currentTreeId) return;

        const currentTree = get().trees.find(tree => tree.id === currentTreeId);
        if (!currentTree) return;

        const branch = currentTree.branches.find(b => b.id === branchId);
        if (!branch) return;

        const updatedBranches = currentTree.branches.map(b => ({
          ...b,
          isActive: b.id === branchId,
        }));

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId 
              ? { 
                  ...tree, 
                  branches: updatedBranches,
                  currentNodeId: branch.leafNodeId,
                  updatedAt: new Date() 
                }
              : tree
          ),
        }));
      },

      // New function to switch branch without changing current node
      switchBranchOnly: (branchId: string) => {
        const { currentTreeId } = get();
        if (!currentTreeId) return;

        const currentTree = get().trees.find(tree => tree.id === currentTreeId);
        if (!currentTree) return;

        const branch = currentTree.branches.find(b => b.id === branchId);
        if (!branch) return;

        const updatedBranches = currentTree.branches.map(b => ({
          ...b,
          isActive: b.id === branchId,
        }));

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId 
              ? { 
                  ...tree, 
                  branches: updatedBranches,
                  updatedAt: new Date() 
                }
              : tree
          ),
        }));
      },

      setCurrentView: (view) => {
        set(state => ({
          uiState: { ...state.uiState, currentView: view },
        }));
      },

      toggleSidebar: () => {
        set(state => ({
          uiState: { ...state.uiState, sidebarCollapsed: !state.uiState.sidebarCollapsed },
        }));
      },

      setTreeViewport: (x, y, zoom) => {
        const { currentTreeId } = get();
        if (!currentTreeId) return;
        
        // Save viewport both globally and per tree
        set(state => ({
          uiState: { ...state.uiState, treeViewport: { x, y, zoom } },
          trees: state.trees.map(tree => 
            tree.id === currentTreeId 
              ? { ...tree, treeViewport: { x, y, zoom } }
              : tree
          ),
        }));
      },

      setSelectedNode: (nodeId) => {
        set(state => ({
          uiState: { ...state.uiState, selectedNodeId: nodeId },
        }));
      },

      setCreatingBranch: (creating) => {
        set(state => ({
          uiState: { ...state.uiState, isCreatingBranch: creating },
        }));
      },

      saveNodePositions: (nodePositions) => {
        const { currentTreeId } = get();
        if (!currentTreeId) return;

        set(state => ({
          trees: state.trees.map(tree => 
            tree.id === currentTreeId 
              ? { ...tree, nodePositions, updatedAt: new Date() }
              : tree
          ),
        }));
      },

      updateApiSettings: (settings) => {
        set(state => ({
          apiSettings: { ...state.apiSettings, ...settings },
        }));
      },

      getCurrentTree: () => {
        const { currentTreeId, trees } = get();
        if (!currentTreeId) return null;
        return trees.find(tree => tree.id === currentTreeId) || null;
      },

      getCurrentPath: () => {
        const currentTree = get().getCurrentTree();
        if (!currentTree) return [];
        return getPathToNode(currentTree, currentTree.currentNodeId);
      },

      getConversationHistory: () => {
        const path = get().getCurrentPath();
        const messages: { role: 'user' | 'assistant'; content: string }[] = [];

        path.forEach(node => {
          messages.push({ role: 'user', content: node.userMessage });
          messages.push({ role: 'assistant', content: node.aiResponse });
        });

        return messages;
      },
      };
    },
    {
      name: 'conversation-store',
      partialize: (state) => ({
        trees: state.trees.map(serializeTree),
        currentTreeId: state.currentTreeId,
        apiSettings: state.apiSettings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.trees) {
          state.trees = state.trees.map((tree: any) => deserializeTree(tree));
        }
        
        if (!state || !state.trees || state.trees.length === 0) {
          const demoTree = createStarCraftDemoTree();
          if (state) {
            state.trees = [demoTree];
            state.currentTreeId = demoTree.id;
          }
        }
      },
    }
  )
);