/**
 * Property Inspector & DartNative Bindings Manager
 */
class PropertyInspector {
  constructor(editorApp) {
    this.app = editorApp;
    this.inspectorContainer = document.getElementById('inspector-properties');
    this.bindingsContainer = document.getElementById('dart-bindings-panel');
  }

  /**
   * Render Inspector Form Controls for the selected node
   */
  renderNodeProperties(node) {
    if (!node) {
      if (this.inspectorContainer) {
        this.inspectorContainer.innerHTML = '<p class="text-muted" style="padding: 10px; text-align: center; color: #9ca3af;">Select a component to inspect properties.</p>';
      }
      if (this.bindingsContainer) {
        this.bindingsContainer.innerHTML = '<p class="text-muted" style="padding: 10px; text-align: center; color: #9ca3af;">Select a component to configure DartNative bindings.</p>';
      }
      return;
    }

    this.renderStyleInspector(node);
    this.renderDartBindings(node);
  }

  /**
   * Render Style & Layout Inspector Form Fields
   */
  renderStyleInspector(node) {
    if (!this.inspectorContainer) return;

    const s = node.style || {};
    const props = node.props || {};

    const isRoot = node.id === this.app.schema.root.id;

    this.inspectorContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 600; font-size: 0.9rem;">${node.id}</span>
        ${!isRoot ? `
          <div style="display: flex; gap: 4px;">
            <button id="btn-duplicate-node" class="btn secondary" style="padding: 3px 6px; font-size: 0.72rem;" title="Duplicate"><i class="fa-solid fa-copy"></i></button>
            <button id="btn-move-up-node" class="btn secondary" style="padding: 3px 6px; font-size: 0.72rem;" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
            <button id="btn-move-down-node" class="btn secondary" style="padding: 3px 6px; font-size: 0.72rem;" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
            <button id="btn-delete-node" class="btn secondary" style="padding: 3px 6px; font-size: 0.72rem; color: #ef4444;" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        ` : ''}
      </div>

      <div class="form-group">
        <label>Node ID</label>
        <input type="text" id="prop-id" class="form-control" value="${node.id}" />
      </div>

      <div class="form-group">
        <label>Node Type</label>
        <input type="text" class="form-control" value="${node.type}" disabled />
      </div>

      <hr style="border-color: var(--border-color); margin: 12px 0;" />
      <h4 style="font-size: 0.8rem; color: var(--accent-color); margin-bottom: 8px;">COMPONENTS PROPS</h4>

      ${['Text', 'Button'].includes(node.type) ? `
        <div class="form-group">
          <label>Display Text</label>
          <input type="text" id="prop-text" class="form-control" value="${props.text || ''}" />
        </div>
      ` : ''}

      ${node.type === 'Image' ? `
        <div class="form-group">
          <label>Image Source URL</label>
          <input type="text" id="prop-src" class="form-control" value="${props.src || ''}" />
        </div>
      ` : ''}

      ${node.type === 'TextInput' ? `
        <div class="form-group">
          <label>Placeholder</label>
          <input type="text" id="prop-placeholder" class="form-control" value="${props.placeholder || ''}" />
        </div>
      ` : ''}

      <div class="form-row">
        <div class="form-group">
          <label>Background Color</label>
          <div style="display: flex; gap: 6px;">
            <input type="color" id="prop-bg-color-picker" value="${props.backgroundColor && props.backgroundColor.startsWith('#') ? props.backgroundColor : '#ffffff'}" style="width: 32px; height: 32px; border: none; background: transparent; cursor: pointer;" />
            <input type="text" id="prop-bg-color" class="form-control" value="${props.backgroundColor || ''}" placeholder="#ffffff" />
          </div>
        </div>
        <div class="form-group">
          <label>Corner Radius (px)</label>
          <input type="number" id="prop-border-radius" class="form-control" value="${props.borderRadius || 0}" />
        </div>
      </div>

      <hr style="border-color: var(--border-color); margin: 12px 0;" />
      <h4 style="font-size: 0.8rem; color: var(--accent-color); margin-bottom: 8px;">YOGA FLEXBOX STYLES</h4>

      <div class="form-group">
        <label>Flex Direction</label>
        <select id="style-flex-direction" class="form-control">
          <option value="column" ${s.flexDirection === 'column' ? 'selected' : ''}>column (Vertical)</option>
          <option value="row" ${s.flexDirection === 'row' ? 'selected' : ''}>row (Horizontal)</option>
          <option value="column-reverse" ${s.flexDirection === 'column-reverse' ? 'selected' : ''}>column-reverse</option>
          <option value="row-reverse" ${s.flexDirection === 'row-reverse' ? 'selected' : ''}>row-reverse</option>
        </select>
      </div>

      <div class="form-group">
        <label>Justify Content (Main Axis)</label>
        <select id="style-justify-content" class="form-control">
          <option value="flex-start" ${s.justifyContent === 'flex-start' ? 'selected' : ''}>flex-start</option>
          <option value="center" ${s.justifyContent === 'center' ? 'selected' : ''}>center</option>
          <option value="flex-end" ${s.justifyContent === 'flex-end' ? 'selected' : ''}>flex-end</option>
          <option value="space-between" ${s.justifyContent === 'space-between' ? 'selected' : ''}>space-between</option>
          <option value="space-around" ${s.justifyContent === 'space-around' ? 'selected' : ''}>space-around</option>
          <option value="space-evenly" ${s.justifyContent === 'space-evenly' ? 'selected' : ''}>space-evenly</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Align Items</label>
          <select id="style-align-items" class="form-control">
            <option value="stretch" ${s.alignItems === 'stretch' ? 'selected' : ''}>stretch</option>
            <option value="flex-start" ${s.alignItems === 'flex-start' ? 'selected' : ''}>flex-start</option>
            <option value="center" ${s.alignItems === 'center' ? 'selected' : ''}>center</option>
            <option value="flex-end" ${s.alignItems === 'flex-end' ? 'selected' : ''}>flex-end</option>
            <option value="baseline" ${s.alignItems === 'baseline' ? 'selected' : ''}>baseline</option>
          </select>
        </div>

        <div class="form-group">
          <label>Align Self</label>
          <select id="style-align-self" class="form-control">
            <option value="auto" ${s.alignSelf === 'auto' || !s.alignSelf ? 'selected' : ''}>auto</option>
            <option value="flex-start" ${s.alignSelf === 'flex-start' ? 'selected' : ''}>flex-start</option>
            <option value="center" ${s.alignSelf === 'center' ? 'selected' : ''}>center</option>
            <option value="flex-end" ${s.alignSelf === 'flex-end' ? 'selected' : ''}>flex-end</option>
            <option value="stretch" ${s.alignSelf === 'stretch' ? 'selected' : ''}>stretch</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Flex Grow</label>
          <input type="number" id="style-flex-grow" class="form-control" value="${s.flexGrow !== undefined ? s.flexGrow : 0}" />
        </div>
        <div class="form-group">
          <label>Flex Shrink</label>
          <input type="number" id="style-flex-shrink" class="form-control" value="${s.flexShrink !== undefined ? s.flexShrink : 1}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Width</label>
          <input type="text" id="style-width" class="form-control" value="${s.width || ''}" placeholder="auto / 100% / 200" />
        </div>
        <div class="form-group">
          <label>Height</label>
          <input type="text" id="style-height" class="form-control" value="${s.height || ''}" placeholder="auto / 100% / 200" />
        </div>
      </div>

      <div class="form-group">
        <label>Aspect Ratio (e.g. 1.77 or 1)</label>
        <input type="text" id="style-aspect-ratio" class="form-control" value="${s.aspectRatio || ''}" placeholder="e.g. 1.778" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Padding (px)</label>
          <input type="number" id="style-padding" class="form-control" value="${s.padding || 0}" />
        </div>
        <div class="form-group">
          <label>Margin (px)</label>
          <input type="number" id="style-margin" class="form-control" value="${s.margin || 0}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Row Gap (px)</label>
          <input type="number" id="style-row-gap" class="form-control" value="${s.rowGap || 0}" />
        </div>
        <div class="form-group">
          <label>Column Gap (px)</label>
          <input type="number" id="style-col-gap" class="form-control" value="${s.columnGap || 0}" />
        </div>
      </div>
    `;

    this.attachInspectorEvents(node);
  }

  /**
   * Bind event handlers to update node properties in real-time
   */
  attachInspectorEvents(node) {
    const bindInput = (id, callback) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', (e) => callback(e.target.value));
    };

    bindInput('prop-id', (val) => { node.id = val; this.app.notifyUpdate(); });
    bindInput('prop-text', (val) => { node.props.text = val; this.app.notifyUpdate(); });
    bindInput('prop-src', (val) => { node.props.src = val; this.app.notifyUpdate(); });
    bindInput('prop-placeholder', (val) => { node.props.placeholder = val; this.app.notifyUpdate(); });

    bindInput('prop-bg-color', (val) => { node.props.backgroundColor = val; this.app.notifyUpdate(); });
    bindInput('prop-bg-color-picker', (val) => {
      node.props.backgroundColor = val;
      const textBg = document.getElementById('prop-bg-color');
      if (textBg) textBg.value = val;
      this.app.notifyUpdate();
    });

    bindInput('prop-border-radius', (val) => { node.props.borderRadius = parseFloat(val) || 0; this.app.notifyUpdate(); });

    bindInput('style-flex-direction', (val) => { node.style.flexDirection = val; this.app.notifyUpdate(); });
    bindInput('style-justify-content', (val) => { node.style.justifyContent = val; this.app.notifyUpdate(); });
    bindInput('style-align-items', (val) => { node.style.alignItems = val; this.app.notifyUpdate(); });
    bindInput('style-align-self', (val) => { node.style.alignSelf = val; this.app.notifyUpdate(); });
    bindInput('style-flex-grow', (val) => { node.style.flexGrow = parseFloat(val) || 0; this.app.notifyUpdate(); });
    bindInput('style-flex-shrink', (val) => { node.style.flexShrink = parseFloat(val) || 0; this.app.notifyUpdate(); });

    const parseDimension = (val) => val && !isNaN(val) ? parseFloat(val) : val;
    bindInput('style-width', (val) => { node.style.width = parseDimension(val); this.app.notifyUpdate(); });
    bindInput('style-height', (val) => { node.style.height = parseDimension(val); this.app.notifyUpdate(); });
    bindInput('style-aspect-ratio', (val) => { node.style.aspectRatio = parseDimension(val); this.app.notifyUpdate(); });
    bindInput('style-padding', (val) => { node.style.padding = parseFloat(val) || 0; this.app.notifyUpdate(); });
    bindInput('style-margin', (val) => { node.style.margin = parseFloat(val) || 0; this.app.notifyUpdate(); });
    bindInput('style-row-gap', (val) => { node.style.rowGap = parseFloat(val) || 0; this.app.notifyUpdate(); });
    bindInput('style-col-gap', (val) => { node.style.columnGap = parseFloat(val) || 0; this.app.notifyUpdate(); });

    // Node Action Buttons
    document.getElementById('btn-duplicate-node')?.addEventListener('click', () => this.app.duplicateNode(node.id));
    document.getElementById('btn-move-up-node')?.addEventListener('click', () => this.app.moveNode(node.id, -1));
    document.getElementById('btn-move-down-node')?.addEventListener('click', () => this.app.moveNode(node.id, 1));
    document.getElementById('btn-delete-node')?.addEventListener('click', () => this.app.deleteNode(node.id));
  }

  /**
   * Render DartNative Event & Action Binding Controls
   */
  renderDartBindings(node) {
    if (!this.bindingsContainer) return;

    node.bindings = node.bindings || {};

    this.bindingsContainer.innerHTML = `
      <div style="margin-bottom: 12px; font-size: 0.8rem; color: var(--text-muted);">
        Configure native event handlers and dynamic state triggers that link directly to Dart classes via <strong>DartNative Interface</strong>.
      </div>

      <div class="form-group">
        <label><i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> On Click Action (Dart Method)</label>
        <input type="text" id="bind-onclick" class="form-control" value="${node.bindings.onClick || ''}" placeholder="e.g. handleButtonPress" />
      </div>

      <div class="form-group">
        <label><i class="fa-solid fa-pen-to-square" style="color: #10b981;"></i> On Changed Action (Dart Method)</label>
        <input type="text" id="bind-onchanged" class="form-control" value="${node.bindings.onChanged || ''}" placeholder="e.g. onSearchTextChanged" />
      </div>

      <div class="form-group">
        <label><i class="fa-solid fa-arrows-rotate" style="color: #3b82f6;"></i> State Binding Property</label>
        <input type="text" id="bind-state" class="form-control" value="${node.bindings.stateBind || ''}" placeholder="e.g. userProfile.userName" />
      </div>
    `;

    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          node.bindings[key] = e.target.value;
          this.app.notifyUpdate();
        });
      }
    };

    bindInput('bind-onclick', 'onClick');
    bindInput('bind-onchanged', 'onChanged');
    bindInput('bind-state', 'stateBind');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PropertyInspector;
}
