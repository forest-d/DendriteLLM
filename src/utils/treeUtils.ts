import { ConversationNode, ConversationTree, Branch } from '../types';

export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateTreeId(): string {
  return `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBranchId(): string {
  return `branch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createRootNode(userMessage: string, aiResponse: string, branchId: string = 'main'): ConversationNode {
  const id = generateNodeId();
  return {
    id,
    parentId: null,
    userMessage,
    aiResponse,
    timestamp: new Date(),
    children: [],
    metadata: {
      timestamp: new Date(),
    },
    branchId,
  };
}

export function createChildNode(
  parentId: string,
  userMessage: string,
  aiResponse: string,
  branchId: string
): ConversationNode {
  const id = generateNodeId();
  return {
    id,
    parentId,
    userMessage,
    aiResponse,
    timestamp: new Date(),
    children: [],
    metadata: {
      timestamp: new Date(),
    },
    branchId,
  };
}

export function getPathToNode(
  tree: ConversationTree,
  nodeId: string
): ConversationNode[] {
  const path: ConversationNode[] = [];
  let currentId: string | null = nodeId;

  while (currentId) {
    const node = tree.nodes.get(currentId);
    if (!node) break;
    
    path.unshift(node);
    currentId = node.parentId;
  }

  return path;
}

export function getConversationContext(
  tree: ConversationTree,
  nodeId: string
): { role: 'user' | 'assistant'; content: string }[] {
  const path = getPathToNode(tree, nodeId);
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];

  path.forEach(node => {
    messages.push({ role: 'user', content: node.userMessage });
    messages.push({ role: 'assistant', content: node.aiResponse });
  });

  return messages;
}

export function addNodeToTree(
  tree: ConversationTree,
  parentId: string,
  userMessage: string,
  aiResponse: string,
  branchId: string
): { tree: ConversationTree; nodeId: string } {
  const newNode = createChildNode(parentId, userMessage, aiResponse, branchId);
  
  const updatedNodes = new Map(tree.nodes);
  updatedNodes.set(newNode.id, newNode);
  
  const parentNode = updatedNodes.get(parentId);
  if (parentNode) {
    parentNode.children.push(newNode.id);
    updatedNodes.set(parentId, parentNode);
  }

  const updatedTree: ConversationTree = {
    ...tree,
    nodes: updatedNodes,
    currentNodeId: newNode.id,
    updatedAt: new Date(),
  };

  return { tree: updatedTree, nodeId: newNode.id };
}

export function createBranchFromNode(
  tree: ConversationTree,
  nodeId: string,
  branchName: string
): { tree: ConversationTree; branch: Branch } {
  const branch: Branch = {
    id: generateBranchId(),
    name: branchName,
    rootNodeId: tree.rootId,
    leafNodeId: nodeId,
    isActive: false,
  };

  const updatedTree: ConversationTree = {
    ...tree,
    branches: [...tree.branches, branch],
    currentNodeId: nodeId,
    updatedAt: new Date(),
  };

  return { tree: updatedTree, branch };
}

export function getLeafNodes(tree: ConversationTree): ConversationNode[] {
  const leafNodes: ConversationNode[] = [];
  
  tree.nodes.forEach(node => {
    if (node.children.length === 0) {
      leafNodes.push(node);
    }
  });

  return leafNodes;
}

export function getTreeDepth(tree: ConversationTree): number {
  let maxDepth = 0;

  function calculateDepth(nodeId: string, currentDepth: number): void {
    const node = tree.nodes.get(nodeId);
    if (!node) return;

    maxDepth = Math.max(maxDepth, currentDepth);
    
    node.children.forEach(childId => {
      calculateDepth(childId, currentDepth + 1);
    });
  }

  calculateDepth(tree.rootId, 0);
  return maxDepth;
}