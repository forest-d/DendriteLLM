import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Position,
  Handle,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MessageSquare, GitBranch, Play, Plus } from 'lucide-react';
import { useConversationStore } from '../store';
import { ConversationNode, ConversationTree, Branch } from '../types';

function findBranchContainingNode(tree: ConversationTree, nodeId: string): Branch | null {
  const node = tree.nodes.get(nodeId);
  if (!node) return tree.branches[0] || null;
  
  const branch = tree.branches.find(b => b.id === node.branchId);
  return branch || tree.branches[0] || null;
}

interface ConversationNodeData {
  node: ConversationNode;
  isCurrentPath: boolean;
  isSelected: boolean;
  userQuery: string;
  responsePreview: string;
}

function ConversationNodeComponent({ data }: { data: ConversationNodeData }) {
  const { navigateToNode, createBranch, setCurrentView, getCurrentTree, switchBranchOnly } = useConversationStore();
  const { node, isCurrentPath, isSelected, userQuery, responsePreview } = data;

  const handleNodeClick = () => {
    const currentTree = getCurrentTree();
    if (!currentTree) return;

    const nodeBranch = findBranchContainingNode(currentTree, node.id);
    
    if (nodeBranch && !nodeBranch.isActive) {
      switchBranchOnly(nodeBranch.id);
    }
    
    navigateToNode(node.id);
  };

  const handleNodeDoubleClick = () => {
    handleNodeClick();
    setCurrentView('chat');
  };

  const handleCreateBranch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const branchName = prompt('Enter branch name:');
    if (branchName?.trim()) {
      createBranch(node.id, branchName.trim());
      navigateToNode(node.id);
    }
  };

  const isRoot = !node.parentId;
  
  return (
    <>
      {/* Input handle (target) - hidden for root node */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#10b981', width: 8, height: 8 }}
        />
      )}
      
      {/* Output handle (source) - hidden if no children */}
      {node.children.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#10b981', width: 8, height: 8 }}
        />
      )}
      
      <div
      className={`
        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-48 max-w-64
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
          : isCurrentPath
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20 shadow-md'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${isRoot ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' : ''}
      `}
      onClick={handleNodeClick}
      onDoubleClick={handleNodeDoubleClick}
      title="Click to navigate • Double-click to switch to chat"
    >
      {/* Node type indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          {isRoot ? (
            <Play className="w-4 h-4 text-purple-600" />
          ) : (
            <MessageSquare className="w-4 h-4 text-blue-600" />
          )}
          <span className="text-xs font-medium text-gray-500">
            {isRoot ? 'Start' : `Msg ${node.id.slice(-4)}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {node.children.length > 0 && (
            <>
              <GitBranch className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">{node.children.length}</span>
            </>
          )}
          
          {/* Branch creation button */}
          <button
            onClick={handleCreateBranch}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title="Create branch from this message"
          >
            <Plus className="w-3 h-3 text-green-600" />
          </button>
        </div>
      </div>

      {/* User query preview */}
      <div className="mb-2">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Query:
        </div>
        <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
          {userQuery}
        </div>
      </div>

      {/* AI response preview */}
      <div>
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Response:
        </div>
        <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight">
          {responsePreview}
        </div>
      </div>

      {/* Current node indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      )}
      </div>
    </>
  );
}

// Define nodeTypes outside component to prevent recreation
const nodeTypes = {
  conversation: ConversationNodeComponent,
};

function TreeViewContent() {
  const {
    getCurrentTree,
    getCurrentPath,
    uiState,
    setTreeViewport,
    saveNodePositions,
  } = useConversationStore();

  const currentTree = getCurrentTree();
  const currentPath = getCurrentPath();
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, defaultOnNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Track current tree ID to detect when tree changes
  const currentTreeIdRef = useRef<string | null>(null);
  const isTreeViewMountedRef = useRef<boolean>(false);
  
  // Restore viewport when tree changes OR when returning to tree view
  useEffect(() => {
    if (!currentTree) return;
    
    const isTreeChange = currentTree.id !== currentTreeIdRef.current;
    const isReturningToTreeView = !isTreeViewMountedRef.current;
    
    if (isTreeChange) {
      currentTreeIdRef.current = currentTree.id;
    }
    
    if (isTreeChange || isReturningToTreeView) {
      isTreeViewMountedRef.current = true;
      
      const timer = setTimeout(() => {
        if (currentTree.treeViewport) {
          const { x, y, zoom } = currentTree.treeViewport;
          reactFlowInstance.setViewport({ x, y, zoom });
        } else if (nodes.length > 0 && isTreeChange) {
          reactFlowInstance.fitView({ padding: 0.2 });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentTree?.id, currentTree?.treeViewport, reactFlowInstance, nodes.length]);
  
  // Clean up mounted flag when component unmounts
  useEffect(() => {
    return () => {
      isTreeViewMountedRef.current = false;
    };
  }, []);

  const onNodesChange = useCallback((changes: any[]) => {
    defaultOnNodesChange(changes);
    
    const positionChanges = changes.filter(change => 
      change.type === 'position' && change.position && change.dragging === false
    );
    
    if (positionChanges.length > 0 && currentTree) {
      const newPositions = new Map(currentTree.nodePositions || new Map());
      
      positionChanges.forEach(change => {
        newPositions.set(change.id, change.position);
      });
      
      saveNodePositions(newPositions);
    }
  }, [defaultOnNodesChange, saveNodePositions, currentTree]);

  // Convert conversation tree to React Flow nodes and edges
  useEffect(() => {
    if (!currentTree) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    const positions = new Map<string, { x: number; y: number }>();
    const pathNodeIds = new Set(currentPath.map(node => node.id));

    const existingPositions = new Map<string, { x: number; y: number }>();
    
    if (currentTree.nodePositions) {
      currentTree.nodePositions.forEach((position, nodeId) => {
        existingPositions.set(nodeId, position);
      });
    }
    
    nodes.forEach(node => {
      if (!existingPositions.has(node.id)) {
        existingPositions.set(node.id, node.position);
      }
    });

    const calculatePositions = () => {
      const branchGroups = new Map<string, string[]>();
      const nodeDepths = new Map<string, number>();
      
      currentTree.nodes.forEach((node, nodeId) => {
        if (!branchGroups.has(node.branchId)) {
          branchGroups.set(node.branchId, []);
        }
        branchGroups.get(node.branchId)!.push(nodeId);
        
        let depth = 0;
        let currentNodeId: string | null = nodeId;
        while (currentNodeId) {
          const currentNode = currentTree.nodes.get(currentNodeId);
          if (!currentNode || !currentNode.parentId) break;
          depth++;
          currentNodeId = currentNode.parentId;
        }
        nodeDepths.set(nodeId, depth);
      });
      
      const sortedBranches = Array.from(branchGroups.keys()).sort((a, b) => {
        if (a === 'main') return -1;
        if (b === 'main') return 1;
        return a.localeCompare(b);
      });
      
      const VERTICAL_SPACING = 180;
      const HORIZONTAL_SPACING = 120;
      const NODE_WIDTH = 280;
      
      let branchOffsetX = 0;
      
      sortedBranches.forEach((branchId, branchIndex) => {
        const branchNodes = branchGroups.get(branchId)!;
        const sortedBranchNodes = branchNodes.sort((a, b) => 
          nodeDepths.get(a)! - nodeDepths.get(b)!
        );
        
        const maxDepth = Math.max(...sortedBranchNodes.map(nodeId => nodeDepths.get(nodeId)!));
        const depthGroups = new Map<number, string[]>();
        
        sortedBranchNodes.forEach(nodeId => {
          const depth = nodeDepths.get(nodeId)!;
          if (!depthGroups.has(depth)) {
            depthGroups.set(depth, []);
          }
          depthGroups.get(depth)!.push(nodeId);
        });
        
        for (let depth = 0; depth <= maxDepth; depth++) {
          const nodesAtDepth = depthGroups.get(depth) || [];
          
          nodesAtDepth.forEach((nodeId, nodeIndex) => {
            if (existingPositions.has(nodeId)) {
              positions.set(nodeId, existingPositions.get(nodeId)!);
            } else {
              const nodeSpacing = nodesAtDepth.length > 1 ? HORIZONTAL_SPACING / 2 : 0;
              const startX = branchOffsetX - (nodeSpacing * (nodesAtDepth.length - 1)) / 2;
              const x = startX + nodeIndex * nodeSpacing;
              const y = depth * VERTICAL_SPACING;
              
              positions.set(nodeId, { x, y });
            }
          });
        }
        
        const branchWidth = Math.max(NODE_WIDTH, HORIZONTAL_SPACING * Math.max(1, 
          Math.max(...Array.from(depthGroups.values()).map(nodes => nodes.length))
        ));
        
        branchOffsetX += branchWidth + (HORIZONTAL_SPACING * 0.5);
      });
    };

    // Calculate all positions using the improved algorithm
    calculatePositions();

    // Create React Flow nodes
    currentTree.nodes.forEach((node, nodeId) => {
      const position = positions.get(nodeId) || { x: 0, y: 0 };
      const isCurrentPath = pathNodeIds.has(nodeId);
      const isSelected = currentTree.currentNodeId === nodeId || uiState.selectedNodeId === nodeId;

      // Truncate text for preview
      const userQuery = node.userMessage.length > 100 
        ? node.userMessage.substring(0, 100) + '...'
        : node.userMessage;
      
      const responsePreview = node.aiResponse.length > 150
        ? node.aiResponse.substring(0, 150) + '...'
        : node.aiResponse;

      flowNodes.push({
        id: nodeId,
        type: 'conversation',
        position,
        data: {
          node,
          isCurrentPath,
          isSelected,
          userQuery,
          responsePreview,
        },
      });
    });

    // Create React Flow edges
    currentTree.nodes.forEach((node, nodeId) => {
      node.children.forEach(childId => {
        const isCurrentPathEdge = pathNodeIds.has(nodeId) && pathNodeIds.has(childId);
        
        flowEdges.push({
          id: `${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: 'smoothstep',
          style: {
            stroke: isCurrentPathEdge ? '#10b981' : '#d1d5db',
            strokeWidth: isCurrentPathEdge ? 3 : 2,
          },
          animated: isCurrentPathEdge,
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [currentTree?.id, currentTree?.currentNodeId, currentPath.length, uiState.selectedNodeId]);

  // Debounced viewport change handler to prevent excessive updates
  const onViewportChange = useCallback((viewport: any) => {
    // Use setTimeout to debounce viewport updates
    const timeoutId = setTimeout(() => {
      setTreeViewport(viewport.x, viewport.y, viewport.zoom);
    }, 200);
    
    // Store timeout ID on the function to clear previous timeouts
    if ((onViewportChange as any).timeoutId) {
      clearTimeout((onViewportChange as any).timeoutId);
    }
    (onViewportChange as any).timeoutId = timeoutId;
  }, [setTreeViewport]);

  if (!currentTree) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <GitBranch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Conversation Tree Selected
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            Create a conversation to see its tree structure.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Tree Header with Branch Info */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{currentTree.name} - Tree View</h2>
            <p className="text-sm text-gray-500">
              {currentTree.nodes.size} node{currentTree.nodes.size !== 1 ? 's' : ''} • {currentTree.branches.length} branch{currentTree.branches.length !== 1 ? 'es' : ''}
            </p>
          </div>
          
          {/* Branch Selector */}
          {currentTree.branches.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Viewing Branch:</span>
              <select
                value={currentTree.branches.find(b => b.isActive)?.id || 'main'}
                onChange={(e) => {
                  const { selectBranch } = useConversationStore.getState();
                  selectBranch(e.target.value);
                }}
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
        
        {/* Current Branch Badge (when only one branch) */}
        {currentTree.branches.length === 1 && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <GitBranch className="w-3 h-3 mr-1" />
              {currentTree.branches[0].name}
            </span>
          </div>
        )}
        
        {/* Multiple Branches Display */}
        {currentTree.branches.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {currentTree.branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => {
                  const { selectBranch } = useConversationStore.getState();
                  selectBranch(branch.id);
                }}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${
                  branch.isActive
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 ring-2 ring-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <GitBranch className="w-3 h-3 mr-1" />
                {branch.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onViewportChange={onViewportChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          <MiniMap 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            nodeColor={(node) => {
              const data = node.data as unknown as ConversationNodeData;
              if (data.isSelected) return '#3b82f6';
              if (data.isCurrentPath) return '#10b981';
              if (!data.node.parentId) return '#8b5cf6';
              return '#6b7280';
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </ReactFlow>
      </div>
    </>
  );
}

export function TreeView() {
  return (
    <div className="flex-1 h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      <ReactFlowProvider>
        <TreeViewContent />
      </ReactFlowProvider>
    </div>
  );
}