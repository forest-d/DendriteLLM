import { ConversationTree, ConversationNode, Branch } from '../types';
import { 
  generateTreeId, 
  generateNodeId, 
  generateBranchId,
  createRootNode,
  createChildNode 
} from './treeUtils';

export function createStarCraftDemoTree(): ConversationTree {
  const treeId = generateTreeId();
  const nodes = new Map<string, ConversationNode>();
  
  // Create root node
  const rootNode = createRootNode(
    "What is StarCraft?",
    "StarCraft is a real-time strategy (RTS) game developed by Blizzard Entertainment, first released in 1998. It's set in a science fiction universe and features three distinct races: the Terrans (humans), Protoss (advanced alien race), and Zerg (insectoid alien race). The game is renowned for its balanced gameplay, deep strategic elements, and has become one of the most influential RTS games of all time, particularly in the esports scene.",
    'main'
  );
  nodes.set(rootNode.id, rootNode);

  // Create main branches off the root
  
  // 1. Game Development branch
  const gameDevBranchId = generateBranchId();
  const gameDevNode = createChildNode(
    rootNode.id,
    "Tell me about StarCraft's development history",
    "StarCraft was developed by Blizzard Entertainment between 1995-1998. Initially conceived as a fantasy-themed RTS, it evolved into a sci-fi setting. The development team, led by Chris Metzen and Rob Pardo, drew inspiration from games like Command & Conquer and Warcraft II. The game's three asymmetric races were a revolutionary design choice that set it apart from other RTS games of the time.",
    gameDevBranchId
  );
  nodes.set(gameDevNode.id, gameDevNode);
  rootNode.children.push(gameDevNode.id);

  const gameDevNode2 = createChildNode(
    gameDevNode.id,
    "What made StarCraft's design so innovative?",
    "StarCraft's innovation came from perfect asymmetric balance - three completely different races that were equally viable. Unlike other RTS games where factions were mostly cosmetic, Terran, Protoss, and Zerg had fundamentally different mechanics: Terran focused on versatility and defense, Protoss on powerful but expensive units, and Zerg on speed and overwhelming numbers. This created rock-paper-scissors dynamics at every level.",
    gameDevBranchId
  );
  nodes.set(gameDevNode2.id, gameDevNode2);
  gameDevNode.children.push(gameDevNode2.id);

  // 2. Strategies branch (main strategies)
  const strategiesBranchId = generateBranchId();
  const strategiesNode = createChildNode(
    rootNode.id,
    "What are the main strategic concepts in StarCraft?",
    "StarCraft strategy revolves around economy, military, and technology. Key concepts include: macro management (economy and production), micro management (unit control), build orders (optimal development sequences), map control, resource management, and timing attacks. Each race has unique strategic approaches - Terran focuses on positioning and siege tactics, Protoss on decisive engagements with superior technology, and Zerg on economic advantage and overwhelming swarm tactics.",
    strategiesBranchId
  );
  nodes.set(strategiesNode.id, strategiesNode);
  rootNode.children.push(strategiesNode.id);

  // Sub-branches for each race under Strategies
  
  // 2a. Terran Strategies
  const terranBranchId = generateBranchId();
  const terranNode = createChildNode(
    strategiesNode.id,
    "What are effective Terran strategies?",
    "Terran strategies emphasize versatility and defensive capabilities. Popular builds include: Marine/Medic pushes, Tank contains with siege positioning, Mech builds focusing on Goliaths and Tanks, and bio-ball compositions. Key strengths: strong defensive structures (bunkers, turrets), versatile units that can attack air and ground, and excellent siege capabilities. Weakness: relatively slow and resource-intensive compared to other races.",
    terranBranchId
  );
  nodes.set(terranNode.id, terranNode);
  strategiesNode.children.push(terranNode.id);

  const terranNode2 = createChildNode(
    terranNode.id,
    "How do you execute a Marine/Medic timing push?",
    "Marine/Medic timing hits around 7-9 minutes with 2-3 medics and 12-16 marines. Build order: Barracks → Academy → 2nd Barracks → Medic research → attack. Key is hitting before enemy gets splash damage or heavy armor. Micro tips: keep medics behind marines, stim only when engaging, and focus fire priority targets. This build punishes greedy economic play and can end games quickly.",
    terranBranchId
  );
  nodes.set(terranNode2.id, terranNode2);
  terranNode.children.push(terranNode2.id);

  // 2b. Protoss Strategies  
  const protossBranchId = generateBranchId();
  const protossNode = createChildNode(
    strategiesNode.id,
    "What are key Protoss strategic approaches?",
    "Protoss relies on superior technology and powerful units. Core strategies: Zealot/Dragoon gateway pressure, Carrier/Arbiter late-game compositions, Dark Templar harassment, and Reaver/Shuttle drops. Protoss excels at: high-damage units, strong defensive structures (photon cannons), powerful late-game units, and game-changing abilities (recall, stasis). Weakness: expensive units make losses costly, slow early game, vulnerable to rushes.",
    protossBranchId
  );
  nodes.set(protossNode.id, protossNode);
  strategiesNode.children.push(protossNode.id);

  const protossNode2 = createChildNode(
    protossNode.id,
    "How effective are Dark Templar in competitive play?",
    "Dark Templars are high-risk, high-reward harassment units. They're permanently cloaked and deal massive damage, capable of killing workers in 2 hits. Best used: early game before detection, hit-and-run attacks on expansions, forcing defensive spending on detection. Counter-play: mobile detection (overlords, science vessels), static detection (turrets, cannons), or pre-emptive scouting to prepare. DTs can single-handedly win games but become much less effective once detection is established.",
    protossBranchId
  );
  nodes.set(protossNode2.id, protossNode2);
  protossNode.children.push(protossNode2.id);

  // 2c. Zerg Strategies
  const zergBranchId = generateBranchId();
  const zergNode = createChildNode(
    strategiesNode.id,
    "What defines successful Zerg play?",
    "Zerg success comes from economic superiority and map control. Key concepts: creep spread for mobility, overlord placement for vision, fast expansion for economic advantage, and unit production efficiency. Popular strategies: Zergling rushes, Mutalisk harassment, Lurker contain, and Ultralisk/Defiler late game. Zerg strengths: fastest expansion, cheapest units, best map control, powerful late-game spells. Weakness: fragile economy, weak anti-air early game.",
    zergBranchId
  );
  nodes.set(zergNode.id, zergNode);
  strategiesNode.children.push(zergNode.id);

  const zergNode2 = createChildNode(
    zergNode.id,
    "How do you properly execute Mutalisk harassment?",
    "Mutalisk harassment requires: 9-pool → lair → spire timing around 6-7 minutes, aiming for 6-9 mutalisks initially. Target priority: workers, isolated units, and weak spots in base defense. Micro essentials: stack mutalisks to minimize surface area, use hit-and-run tactics, avoid anti-air clusters. Map awareness is crucial - constantly move between enemy bases, retreat when threatened. Successful muta play forces static defense investment and keeps enemy contained while you expand.",
    zergBranchId
  );
  nodes.set(zergNode2.id, zergNode2);
  zergNode.children.push(zergNode2.id);

  // 3. Competitive Scene branch
  const competitiveBranchId = generateBranchId();
  const competitiveNode = createChildNode(
    rootNode.id,
    "Tell me about StarCraft's competitive scene",
    "StarCraft revolutionized esports, particularly in South Korea where it became a cultural phenomenon. The game launched professional gaming with leagues like OSL and MSL, featuring legendary players like BoxeR, NaDa, and iloveosu. StarCraft's competitive scene established many esports traditions: professional teams, sponsorships, live broadcasts, and massive tournaments. The scene peaked in the 2000s with TV broadcasts and stadium-filling events, laying groundwork for modern esports.",
    competitiveBranchId
  );
  nodes.set(competitiveNode.id, competitiveNode);
  rootNode.children.push(competitiveNode.id);

  const competitiveNode2 = createChildNode(
    competitiveNode.id,
    "Who are considered the greatest StarCraft players of all time?",
    "The greatest StarCraft players include: BoxeR (Emperor Terran, revolutionary micro and strategy), NaDa (Genius Terran, most successful in tournaments), iloveosu (Protoss innovator, incredible consistency), Yellow (Storm Zerg, finals king), and Savior (Maestro Zerg, strategic genius before match-fixing scandal). Each contributed unique innovations: BoxeR's marine micro, NaDa's macro management, Yellow's economic builds, Savior's strategic depth. Their legacies shaped how each race is played competitively.",
    competitiveBranchId
  );
  nodes.set(competitiveNode2.id, competitiveNode2);
  competitiveNode.children.push(competitiveNode2.id);

  const competitiveNode3 = createChildNode(
    competitiveNode2.id,
    "What made BoxeR so innovative as a player?",
    "BoxeR (Lim Yo-hwan) earned the title 'Emperor' through revolutionary Terran play. His innovations: marine micro techniques (stutter-step, focus fire), unconventional unit combinations, psychological warfare, and clutch performance under pressure. He popularized marine/medic compositions and showed that 'weak' units could dominate with superior control. BoxeR's charisma and clutch plays in crucial moments made him esports' first major star, inspiring countless players and establishing the template for professional gaming personalities.",
    competitiveBranchId
  );
  nodes.set(competitiveNode3.id, competitiveNode3);
  competitiveNode2.children.push(competitiveNode3.id);

  // Create branches array
  const branches: Branch[] = [
    {
      id: 'main',
      name: 'Main',
      rootNodeId: rootNode.id,
      leafNodeId: rootNode.id,
      isActive: true,
    },
    {
      id: gameDevBranchId,
      name: 'Game Development',
      rootNodeId: rootNode.id,
      leafNodeId: gameDevNode2.id,
      isActive: false,
    },
    {
      id: strategiesBranchId,
      name: 'Strategies',
      rootNodeId: rootNode.id,
      leafNodeId: strategiesNode.id,
      isActive: false,
    },
    {
      id: terranBranchId,
      name: 'Terran Strategies',
      rootNodeId: rootNode.id,
      leafNodeId: terranNode2.id,
      isActive: false,
    },
    {
      id: protossBranchId,
      name: 'Protoss Strategies',
      rootNodeId: rootNode.id,
      leafNodeId: protossNode2.id,
      isActive: false,
    },
    {
      id: zergBranchId,
      name: 'Zerg Strategies',
      rootNodeId: rootNode.id,
      leafNodeId: zergNode2.id,
      isActive: false,
    },
    {
      id: competitiveBranchId,
      name: 'Competitive Scene',
      rootNodeId: rootNode.id,
      leafNodeId: competitiveNode3.id,
      isActive: false,
    },
  ];

  return {
    id: treeId,
    name: 'StarCraft',
    rootId: rootNode.id,
    nodes,
    currentNodeId: rootNode.id,
    branches,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}