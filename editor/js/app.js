/**
 * Main Application Orchestrator for Yoga & DartNative Studio
 */
class VisualEditorApp {
  constructor() {
    this.defaultDashboard = {
      version: "1.0.0",
      screenName: "ProfileDashboardScreen",
      dartModule: "ProfileDashboardController",
      root: {
        id: "rootContainer",
        type: "Container",
        props: { backgroundColor: "#f3f4f6" },
        style: { flexDirection: "column", justifyContent: "flex-start", alignItems: "stretch", flexGrow: 1, padding: 16, rowGap: 16 },
        children: [
          {
            id: "headerCard",
            type: "Container",
            props: { backgroundColor: "#ffffff", borderRadius: 12 },
            style: { flexDirection: "row", alignItems: "center", padding: 16, columnGap: 16 },
            children: [
              {
                id: "userAvatar",
                type: "Image",
                props: { src: "https://via.placeholder.com/60", borderRadius: 30 },
                style: { width: 60, height: 60 }
              },
              {
                id: "userInfoCol",
                type: "Container",
                style: { flexDirection: "column", flexGrow: 1, rowGap: 4 },
                children: [
                  {
                    id: "userNameText",
                    type: "Text",
                    props: { text: "Alex Rivera", textColor: "#111827", fontSize: 18 },
                    bindings: { stateBind: "user.displayName" },
                    style: {}
                  },
                  {
                    id: "userRoleText",
                    type: "Text",
                    props: { text: "Senior Native Mobile Developer", textColor: "#6b7280", fontSize: 13 },
                    style: {}
                  }
                ]
              }
            ]
          },
          {
            id: "actionButton",
            type: "Button",
            props: { text: "Connect via DartNative", backgroundColor: "#6366f1", textColor: "#ffffff", borderRadius: 8 },
            style: { height: 48, justifyContent: "center", alignItems: "center" },
            bindings: { onClick: "onConnectButtonPressed" }
          }
        ]
      }
    };

    this.schema = JSON.parse(JSON.stringify(this.defaultDashboard));
    this.mockData = {
      user: {
        displayName: "Alex Rivera",
        role: "Senior Native Mobile Developer"
      }
    };
    this.selectedNodeId = "rootContainer";
    this.currentLanguage = "dart";

    // Undo / Redo Stacks
    this.history = [JSON.stringify(this.schema)];
    this.historyIndex = 0;

    this.renderer = new CanvasRenderer(this);
    this.inspector = new PropertyInspector(this);
  }

  init() {
    this.bindEvents();
    this.render();
  }

  pushState() {
    const currentState = JSON.stringify(this.schema);
    if (this.history[this.historyIndex] === currentState) return;

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(currentState);
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.schema = JSON.parse(this.history[this.historyIndex]);
      this.render();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.schema = JSON.parse(this.history[this.historyIndex]);
      this.render();
    }
  }

  bindEvents() {
    // Component Palette Click Add
    document.querySelectorAll('.palette-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        this.addComponentNode(type);
      });
    });

    // Device Viewport Switcher
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.getAttribute('data-device');
        const frame = document.getElementById('device-frame');
        if (frame) frame.className = `device-frame ${device}`;
      });
    });

    // Right Sidebar Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId)?.classList.add('active');
      });
    });

    // Code Preview Subtabs
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLanguage = btn.getAttribute('data-lang');
        this.updateCodePreview();
      });
    });

    // Template Selector
    document.getElementById('template-selector')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'profileDashboard') {
        this.schema = JSON.parse(JSON.stringify(this.defaultDashboard));
      } else if (typeof PRESET_TEMPLATES !== 'undefined' && PRESET_TEMPLATES[val]) {
        this.schema = JSON.parse(JSON.stringify(PRESET_TEMPLATES[val]));
      } else {
        return;
      }
      this.selectedNodeId = this.schema.root.id;
      this.pushState();
      this.render();
    });

    // Copy Code Button
    document.getElementById('btn-copy-code')?.addEventListener('click', () => {
      const code = document.getElementById('code-output')?.textContent;
      if (code) {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
      }
    });

    // Undo / Redo Buttons
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Export Buttons
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.schema, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${this.schema.screenName}_layout.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    document.getElementById('btn-export-code')?.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-code"]')?.click();
    });
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    this.render();
  }

  findNode(node, id) {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const found = this.findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  findParentAndIndex(parent, id) {
    if (!parent.children) return null;
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].id === id) {
        return { parent, index: i };
      }
      const found = this.findParentAndIndex(parent.children[i], id);
      if (found) return found;
    }
    return null;
  }

  deleteNode(id) {
    if (id === this.schema.root.id) return; // cannot delete root
    const match = this.findParentAndIndex(this.schema.root, id);
    if (match) {
      match.parent.children.splice(match.index, 1);
      this.selectedNodeId = match.parent.id;
      this.notifyUpdate();
    }
  }

  duplicateNode(id) {
    if (id === this.schema.root.id) return;
    const match = this.findParentAndIndex(this.schema.root, id);
    if (match) {
      const original = match.parent.children[match.index];
      const clone = JSON.parse(JSON.stringify(original));

      const refreshIds = (node) => {
        node.id = `${node.type.toLowerCase()}_${Date.now().toString().slice(-4)}_${Math.floor(Math.random()*100)}`;
        if (node.children) node.children.forEach(refreshIds);
      };
      refreshIds(clone);

      match.parent.children.splice(match.index + 1, 0, clone);
      this.selectedNodeId = clone.id;
      this.notifyUpdate();
    }
  }

  moveNode(id, direction) {
    const match = this.findParentAndIndex(this.schema.root, id);
    if (match) {
      const newIdx = match.index + direction;
      if (newIdx >= 0 && newIdx < match.parent.children.length) {
        const temp = match.parent.children[match.index];
        match.parent.children[match.index] = match.parent.children[newIdx];
        match.parent.children[newIdx] = temp;
        this.notifyUpdate();
      }
    }
  }

  addComponentNode(type) {
    const parent = this.findNode(this.schema.root, this.selectedNodeId) || this.schema.root;
    parent.children = parent.children || [];

    const newId = `${type.toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const newNode = {
      id: newId,
      type: type,
      props: {
        text: type === 'Text' ? 'New Text' : type === 'Button' ? 'New Button' : '',
        placeholder: type === 'TextInput' ? 'Enter text...' : ''
      },
      style: { padding: 8 }
    };

    parent.children.push(newNode);
    this.selectNode(newId);
    this.pushState();
  }

  notifyUpdate() {
    this.pushState();
    this.render();
  }

  render() {
    const selectedNode = this.findNode(this.schema.root, this.selectedNodeId);
    this.renderer.renderTree(this.schema.root, this.selectedNodeId);
    this.inspector.renderNodeProperties(selectedNode);
    this.updateCodePreview();
  }

  updateCodePreview() {
    const codeElem = document.getElementById('code-output');
    if (!codeElem) return;

    let output = '';
    switch (this.currentLanguage) {
      case 'dart':
        output = CodeGenerator.generateDartCode(this.schema);
        break;
      case 'swift':
        output = CodeGenerator.generateSwiftCode(this.schema);
        break;
      case 'kotlin':
        output = CodeGenerator.generateKotlinCode(this.schema);
        break;
      case 'objc':
        output = CodeGenerator.generateObjectiveCCode(this.schema);
        break;
      case 'java':
        output = CodeGenerator.generateJavaCode(this.schema);
        break;
      case 'json':
        output = JSON.stringify(this.schema, null, 2);
        break;
    }
    codeElem.textContent = output;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new VisualEditorApp();
  window.app.init();
});
