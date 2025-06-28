export interface NodeMetadata {
  timestamp: Date;
  tokensUsed?: number;
  model?: string;
  temperature?: number;
  tags?: string[];
}

export interface ConversationNode {
  id: string;
  parentId: string | null;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  children: string[];
  metadata: NodeMetadata;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  color?: string;
  rootNodeId: string;
  leafNodeId: string;
  isActive: boolean;
}

export interface ConversationTree {
  id: string;
  name: string;
  rootId: string;
  nodes: Map<string, ConversationNode>;
  currentNodeId: string;
  branches: Branch[];
  createdAt: Date;
  updatedAt: Date;
  treeViewport?: TreeViewport;
  nodePositions?: Map<string, { x: number; y: number }>;
}

export interface ConversationPath {
  nodes: ConversationNode[];
  branch: Branch;
}

export interface TreeViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface UIState {
  currentView: 'chat' | 'tree' | 'settings';
  sidebarCollapsed: boolean;
  treeViewport: TreeViewport;
  selectedNodeId: string | null;
  isCreatingBranch: boolean;
}

export interface APISettings {
  anthropicApiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AppState {
  trees: ConversationTree[];
  currentTreeId: string | null;
  uiState: UIState;
  apiSettings: APISettings;
}