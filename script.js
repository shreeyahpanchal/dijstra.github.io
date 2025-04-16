document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const graphCanvas = document.getElementById('graphCanvas');
  const ctx = graphCanvas.getContext('2d');
  const createGraphModal = document.getElementById('createGraphModal');
  const addEdgeModal = document.getElementById('addEdgeModal');
  const runAlgorithmModal = document.getElementById('runAlgorithmModal');
  const helpModal = document.getElementById('helpModal');
  const shortestPathResults = document.getElementById('shortestPathResults');
  
  // Buttons
  const addEdgeBtn = document.getElementById('addEdgeBtn');
  const runAlgorithmBtn = document.getElementById('runAlgorithmBtn');
  const resetBtn = document.getElementById('resetBtn');
  const helpBtn = document.getElementById('helpBtn');
  const createGraphBtn = document.getElementById('createGraphBtn');
  const addEdgeSubmitBtn = document.getElementById('addEdgeSubmitBtn');
  const addEdgeCancelBtn = document.getElementById('addEdgeCancelBtn');
  const startAlgorithmBtn = document.getElementById('startAlgorithmBtn');
  const cancelAlgorithmBtn = document.getElementById('cancelAlgorithmBtn');
  const closeHelpBtn = document.getElementById('closeHelpBtn');
  
  // Form Elements
  const numNodesInput = document.getElementById('numNodes');
  const fromNodeSelect = document.getElementById('fromNode');
  const toNodeSelect = document.getElementById('toNode');
  const weightInput = document.getElementById('weight');
  const sourceNodeSelect = document.getElementById('sourceNode');
  
  // Graph Data
  let nodes = [];
  let edges = [];
  let nodeRadius = 20;
  
  // Initialize Canvas
  function initCanvas() {
      graphCanvas.width = graphCanvas.offsetWidth;
      graphCanvas.height = graphCanvas.offsetHeight;
  }
  
  // Show Create Graph Modal on page load
  function showCreateGraphModal() {
      createGraphModal.style.display = 'flex';
  }
  
  // Create Graph
  function createGraph() {
      const numNodes = parseInt(numNodesInput.value);
      if (numNodes < 2) {
          alert('Please enter at least 2 nodes');
          return;
      }
      
      nodes = [];
      edges = [];
      
      // Create nodes in a circular layout
      const centerX = graphCanvas.width / 2;
      const centerY = graphCanvas.height / 2;
      const radius = Math.min(centerX, centerY) - 50;
      
      for (let i = 0; i < numNodes; i++) {
          const angle = (i * 2 * Math.PI) / numNodes;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          nodes.push({
              id: i + 1,
              x: x,
              y: y,
              distance: Infinity,
              visited: false,
              previous: null
          });
      }
      
      createGraphModal.style.display = 'none';
      drawGraph();
      updateNodeSelects();
  }
  
  // Update Node Selection Dropdowns
  function updateNodeSelects() {
      // Clear existing options
      fromNodeSelect.innerHTML = '';
      toNodeSelect.innerHTML = '';
      sourceNodeSelect.innerHTML = '';
      
      // Add options for each node
      nodes.forEach(node => {
          const fromOption = document.createElement('option');
          fromOption.value = node.id;
          fromOption.textContent = `Node ${node.id}`;
          fromNodeSelect.appendChild(fromOption);
          
          const toOption = document.createElement('option');
          toOption.value = node.id;
          toOption.textContent = `Node ${node.id}`;
          toNodeSelect.appendChild(toOption);
          
          const sourceOption = document.createElement('option');
          sourceOption.value = node.id;
          sourceOption.textContent = `Node ${node.id}`;
          sourceNodeSelect.appendChild(sourceOption);
      });
  }
  
  // Draw Graph
  function drawGraph() {
      ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      
      // Draw edges
      edges.forEach(edge => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (fromNode && toNode) {
              drawEdge(fromNode, toNode, edge.weight, edge.highlight);
          }
      });
      
      // Draw nodes
      nodes.forEach(node => {
          drawNode(node);
      });
  }
  
  // Draw Node
  function drawNode(node) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      
      // Set node color based on state
      if (node.isSource) {
          ctx.fillStyle = '#ff9800'; // Orange for source
      } else if (node.isCurrent) {
          ctx.fillStyle = '#f44336'; // Red for current
      } else if (node.visited) {
          ctx.fillStyle = '#4caf50'; // Green for visited
      } else {
          ctx.fillStyle = '#2196f3'; // Blue for default
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Draw node ID
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
  }
  
  // Draw Edge
  function drawEdge(fromNode, toNode, weight, highlight = false) {
      // Draw line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      if (highlight) {
          ctx.strokeStyle = '#ff9800';
          ctx.lineWidth = 3;
      } else {
          ctx.strokeStyle = '#666';
          ctx.lineWidth = 2;
      }
      
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000';
      
      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(midX, midY, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(weight, midX, midY);
  }
  
  // Add Edge
  function addEdge() {
      const fromId = parseInt(fromNodeSelect.value);
      const toId = parseInt(toNodeSelect.value);
      const weight = parseInt(weightInput.value);
      
      if (fromId === toId) {
          alert('Cannot add edge to the same node');
          return;
      }
      
      if (weight <= 0) {
          alert('Weight must be greater than 0');
          return;
      }
      
      // Check if edge already exists
      const existingEdge = edges.find(e => 
          (e.from === fromId && e.to === toId) || 
          (e.from === toId && e.to === fromId)
      );
      
      if (existingEdge) {
          alert('Edge already exists between these nodes');
          return;
      }
      
      edges.push({
          from: fromId,
          to: toId,
          weight: weight,
          highlight: false
      });
      
      addEdgeModal.style.display = 'none';
      drawGraph();
  }
  
  // Run Dijkstra's Algorithm
  function runDijkstra() {
      const sourceId = parseInt(sourceNodeSelect.value);
      const source = nodes.find(n => n.id === sourceId);
      
      if (!source) {
          alert('Source node not found');
          return;
      }
      
      // Reset nodes
      nodes.forEach(node => {
          node.distance = Infinity;
          node.visited = false;
          node.previous = null;
          node.isSource = false;
          node.isCurrent = false;
      });
      
      // Reset edge highlights
      edges.forEach(edge => {
          edge.highlight = false;
      });
      
      // Set source node
      source.distance = 0;
      source.isSource = true;
      
      // Create adjacency list
      const adjacencyList = {};
      nodes.forEach(node => {
          adjacencyList[node.id] = [];
      });
      
      edges.forEach(edge => {
          adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight });
          adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight });
      });
      
      // Priority queue (simple array for demo)
      const unvisited = [...nodes];
      
      // Dijkstra's algorithm
      while (unvisited.length > 0) {
          // Find node with minimum distance
          unvisited.sort((a, b) => a.distance - b.distance);
          const current = unvisited.shift();
          
          if (current.distance === Infinity) break;
          
          current.visited = true;
          current.isCurrent = true;
          
          // Update neighbors
          adjacencyList[current.id].forEach(neighbor => {
              const neighborNode = nodes.find(n => n.id === neighbor.node);
              if (!neighborNode.visited) {
                  const distance = current.distance + neighbor.weight;
                  if (distance < neighborNode.distance) {
                      neighborNode.distance = distance;
                      neighborNode.previous = current.id;
                  }
              }
          });
          
          // Highlight the path
          highlightPaths();
          
          // Update current node
          current.isCurrent = false;
      }
      
      // Display results
      displayResults();
      
      runAlgorithmModal.style.display = 'none';
      drawGraph();
  }
  
  // Highlight Shortest Paths
  function highlightPaths() {
      edges.forEach(edge => {
          edge.highlight = false;
      });
      
      nodes.forEach(node => {
          if (node.previous !== null) {
              const edge = edges.find(e => 
                  (e.from === node.id && e.to === node.previous) || 
                  (e.from === node.previous && e.to === node.id)
              );
              
              if (edge) {
                  edge.highlight = true;
              }
          }
      });
  }
  
  // Display Results
  function displayResults() {
      shortestPathResults.innerHTML = '';
      
      const sourceId = parseInt(sourceNodeSelect.value);
      
      nodes.forEach(node => {
          if (node.id !== sourceId) {
              const resultItem = document.createElement('div');
              resultItem.className = 'result-item';
              
              if (node.distance === Infinity) {
                  resultItem.innerHTML = `<strong>Node ${node.id}:</strong> <span class="infinity">∞ (No path)</span>`;
              } else {
                  let path = getPath(node.id);
                  resultItem.innerHTML = `<strong>Node ${node.id}:</strong> Distance = ${node.distance}, Path = ${path.join(' → ')}`;
              }
              
              shortestPathResults.appendChild(resultItem);
          }
      });
  }
  
  // Get Path from Source to Node
  function getPath(nodeId) {
      const path = [];
      let currentId = nodeId;
      
      while (currentId !== null) {
          path.unshift(currentId);
          const node = nodes.find(n => n.id === currentId);
          currentId = node.previous;
      }
      
      return path;
  }
  
  // Reset Graph - FIXED to show Create Graph modal again
  function resetGraph() {
      // Clear all data
      nodes = [];
      edges = [];
      
      // Clear the canvas
      ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      
      // Clear results
      shortestPathResults.innerHTML = '';
      
      // Reset the number of nodes input to default
      numNodesInput.value = 5;
      
      // Show the Create Graph modal again
      showCreateGraphModal();
  }
  
  // Event Listeners
  addEdgeBtn.addEventListener('click', () => {
      addEdgeModal.style.display = 'flex';
  });
  
  runAlgorithmBtn.addEventListener('click', () => {
      if (nodes.length === 0) {
          alert('Please create a graph first');
          return;
      }
      
      if (edges.length === 0) {
          alert('Please add at least one edge');
          return;
      }
      
      runAlgorithmModal.style.display = 'flex';
  });
  
  resetBtn.addEventListener('click', resetGraph);
  
  helpBtn.addEventListener('click', () => {
      helpModal.style.display = 'flex';
  });
  
  createGraphBtn.addEventListener('click', createGraph);
  
  addEdgeSubmitBtn.addEventListener('click', addEdge);
  
  addEdgeCancelBtn.addEventListener('click', () => {
      addEdgeModal.style.display = 'none';
  });
  
  startAlgorithmBtn.addEventListener('click', runDijkstra);
  
  cancelAlgorithmBtn.addEventListener('click', () => {
      runAlgorithmModal.style.display = 'none';
  });
  
  closeHelpBtn.addEventListener('click', () => {
      helpModal.style.display = 'none';
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
      initCanvas();
      drawGraph();
  });
  
  // Initialize
  initCanvas();
  showCreateGraphModal();
});