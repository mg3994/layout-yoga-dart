/**
 * Yoga Canvas Renderer & Viewport Manager
 */
class CanvasRenderer {
  constructor(editorApp) {
    this.app = editorApp;
    this.canvasElement = document.getElementById('yoga-canvas');
    this.treeViewElement = document.getElementById('tree-view');
  }

  /**
   * Render the entire layout tree onto the HTML DOM canvas using Flexbox styles.
   */
  renderTree(rootNode, selectedNodeId) {
    if (!this.canvasElement) return;
    this.canvasElement.innerHTML = '';

    const domNode = this.createDOMNode(rootNode, selectedNodeId);
    this.canvasElement.appendChild(domNode);

    // Also update tree hierarchy view
    this.renderTreeView(rootNode, selectedNodeId);
  }

  /**
   * Converts a Yoga node definition into an HTML DOM element.
   */
  createDOMNode(node, selectedNodeId) {
    const el = document.createElement('div');
    el.className = 'yoga-node';
    if (node.id === selectedNodeId) {
      el.classList.add('selected');
    }
    el.setAttribute('data-node-id', node.id);

    // Apply layout styles from Yoga node schema directly to DOM flexbox
    const s = node.style || {};
    el.style.display = 'flex';
    el.style.flexDirection = s.flexDirection || 'column';
    el.style.justifyContent = s.justifyContent || 'flex-start';
    el.style.alignItems = s.alignItems || 'stretch';
    el.style.flexGrow = s.flexGrow !== undefined ? s.flexGrow : 0;
    el.style.flexShrink = s.flexShrink !== undefined ? s.flexShrink : 1;
    if (s.flexBasis) el.style.flexBasis = typeof s.flexBasis === 'number' ? `${s.flexBasis}px` : s.flexBasis;

    if (s.width) el.style.width = typeof s.width === 'number' ? `${s.width}px` : s.width;
    if (s.height) el.style.height = typeof s.height === 'number' ? `${s.height}px` : s.height;
    if (s.minWidth) el.style.minWidth = typeof s.minWidth === 'number' ? `${s.minWidth}px` : s.minWidth;
    if (s.minHeight) el.style.minHeight = typeof s.minHeight === 'number' ? `${s.minHeight}px` : s.minHeight;

    if (s.padding) el.style.padding = `${s.padding}px`;
    if (s.margin) el.style.margin = `${s.margin}px`;
    if (s.rowGap) el.style.rowGap = `${s.rowGap}px`;
    if (s.columnGap) el.style.columnGap = `${s.columnGap}px`;

    if (s.position) el.style.position = s.position;
    if (s.top) el.style.top = typeof s.top === 'number' ? `${s.top}px` : s.top;
    if (s.bottom) el.style.bottom = typeof s.bottom === 'number' ? `${s.bottom}px` : s.bottom;
    if (s.left) el.style.left = typeof s.left === 'number' ? `${s.left}px` : s.left;
    if (s.right) el.style.right = typeof s.right === 'number' ? `${s.right}px` : s.right;

    // Apply presentation props
    const props = node.props || {};
    if (props.backgroundColor) el.style.backgroundColor = props.backgroundColor;
    if (props.borderRadius) el.style.borderRadius = `${props.borderRadius}px`;

    // Render node-type specific element previews
    switch (node.type) {
      case 'Text': {
        const textSpan = document.createElement('span');
        textSpan.textContent = props.text || 'Text Label';
        textSpan.style.color = props.textColor || '#111827';
        textSpan.style.fontSize = `${props.fontSize || 14}px`;
        el.appendChild(textSpan);
        break;
      }
      case 'Button': {
        const btn = document.createElement('button');
        btn.textContent = props.text || 'Button';
        btn.style.width = '100%';
        btn.style.height = '100%';
        btn.style.padding = '8px 16px';
        btn.style.backgroundColor = props.backgroundColor || '#6366f1';
        btn.style.color = props.textColor || '#ffffff';
        btn.style.border = 'none';
        btn.style.borderRadius = `${props.borderRadius || 6}px`;
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '600';
        el.appendChild(btn);
        break;
      }
      case 'Image': {
        const img = document.createElement('img');
        img.src = props.src || 'https://via.placeholder.com/150';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = `${props.borderRadius || 0}px`;
        el.appendChild(img);
        break;
      }
      case 'TextInput': {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = props.placeholder || 'Enter text...';
        input.style.width = '100%';
        input.style.padding = '8px 12px';
        input.style.border = '1px solid #d1d5db';
        input.style.borderRadius = `${props.borderRadius || 6}px`;
        el.appendChild(input);
        break;
      }
      default:
        break;
    }

    // Node click selection event
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.selectNode(node.id);
    });

    // Recursively render children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        el.appendChild(this.createDOMNode(child, selectedNodeId));
      });
    }

    return el;
  }

  /**
   * Render Tree Hierarchy View in Left Sidebar
   */
  renderTreeView(rootNode, selectedNodeId) {
    if (!this.treeViewElement) return;
    this.treeViewElement.innerHTML = '';

    const buildTreeItem = (node, depth = 0) => {
      const item = document.createElement('div');
      item.className = 'tree-node-item';
      if (node.id === selectedNodeId) item.classList.add('selected');
      item.style.paddingLeft = `${depth * 12 + 8}px`;

      const typeIcons = {
        Container: 'fa-regular fa-square',
        Text: 'fa-solid fa-font',
        Button: 'fa-solid fa-hand-pointer',
        Image: 'fa-regular fa-image',
        TextInput: 'fa-solid fa-i-cursor',
        ScrollView: 'fa-solid fa-arrows-up-down'
      };

      item.innerHTML = `
        <div class="tree-node-info">
          <i class="${typeIcons[node.type] || 'fa-solid fa-cube'}"></i>
          <span>${node.id}</span>
        </div>
        <span class="node-tag-type">${node.type}</span>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.app.selectNode(node.id);
      });

      this.treeViewElement.appendChild(item);

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => buildTreeItem(child, depth + 1));
      }
    };

    buildTreeItem(rootNode);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasRenderer;
}
