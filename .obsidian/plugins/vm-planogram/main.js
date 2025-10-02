"use strict";var o=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var f=(s,e,t)=>e in s?o(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var m=(s,e)=>{for(var t in e)o(s,t,{get:e[t],enumerable:!0})},y=(s,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of p(e))!g.call(s,a)&&a!==t&&o(s,a,{get:()=>e[a],enumerable:!(i=x(e,a))||i.enumerable});return s};var v=s=>y(o({},"__esModule",{value:!0}),s);var d=(s,e,t)=>(f(s,typeof e!="symbol"?e+"":e,t),t);var S={};m(S,{default:()=>r});module.exports=v(S);var n=require("obsidian");var b={defaultStoreWidth:40,defaultStoreHeight:30,autoSave:!1},l="planogram-view",w=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VM Planogram Canvas - Enhanced</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 15px;
            background-color: #f9fafb;
            font-size: 14px;
        }
        .container {
            max-width: 100%;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1f2937;
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .toolbar {
            margin: 10px 0;
            padding: 10px;
            background: #f3f4f6;
            border-radius: 4px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        button:hover { background: #2563eb; }
        button:disabled { background: #9ca3af; cursor: not-allowed; }
        .mode-button.active { background: #059669; }

        #planogram-canvas {
            border: 2px solid #e5e7eb;
            background: white;
            cursor: crosshair;
            display: block;
            margin: 10px 0;
            max-width: 100%;
        }
        .canvas-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            font-size: 12px;
            color: #6b7280;
            flex-wrap: wrap;
            gap: 10px;
        }
        .fixture-properties {
            margin-top: 15px;
            padding: 12px;
            background: #fff7ed;
            border-radius: 4px;
            border: 1px solid #fed7aa;
            display: none;
        }
        .fixture-properties.show { display: block; }
        .property-group {
            display: flex;
            gap: 10px;
            margin: 8px 0;
            flex-wrap: wrap;
        }
        .property-group label {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            font-weight: 500;
            min-width: 80px;
        }
        .property-group input, .property-group select {
            margin-top: 2px;
            padding: 4px 6px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 12px;
        }
        .vm-zone-legend {
            margin-top: 15px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 4px;
        }
        .vm-zone-legend h4 {
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 14px;
        }
        .zone-item {
            display: flex;
            align-items: center;
            margin: 4px 0;
            font-size: 12px;
        }
        .zone-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 6px;
        }
        .status-bar {
            margin-top: 10px;
            padding: 8px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 12px;
            color: #374151;
        }
        .help-text {
            margin-top: 10px;
            padding: 8px;
            background: #eff6ff;
            border-radius: 4px;
            font-size: 11px;
            color: #1e40af;
        }
        @media (max-width: 768px) {
            .toolbar { flex-direction: column; align-items: stretch; }
            .canvas-info { flex-direction: column; align-items: flex-start; }
            .property-group { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Enhanced VM Planogram Canvas</h1>

        <div class="toolbar">
            <button id="selectMode" class="mode-button active">Select</button>
            <button id="addMode" class="mode-button">Add Fixture</button>
            <button id="toggleGrid">Grid</button>
            <button id="clearAll">Clear</button>
            <button id="saveData">Save</button>
            <button id="loadData">Load</button>
            <button id="deleteSelected" disabled>Delete</button>
            <label style="display:flex;align-items:center;gap:4px;font-size:12px;">
                <input type="checkbox" id="snapToGrid" checked> Snap
            </label>
            <label style="display:flex;align-items:center;gap:4px;font-size:12px;">
                Grid:
                <select id="gridSize" style="font-size:12px;padding:4px;">
                    <option value="0.5">0.5'</option>
                    <option value="1" selected>1'</option>
                    <option value="2">2'</option>
                </select>
            </label>
        </div>

        <div class="canvas-info">
            <span>Store: 40' \xD7 30'</span>
            <span id="mouseCoords">Mouse: (0, 0)</span>
            <span id="selectedInfo">No selection</span>
        </div>

        <canvas id="planogram-canvas" width="800" height="600"></canvas>

        <div id="fixtureProperties" class="fixture-properties">
            <h4>Fixture Properties</h4>
            <div class="property-group">
                <label>Name: <input type="text" id="fixtureName"></label>
                <label>Zone:
                    <select id="fixtureZone">
                        <option value="EYE">Eye Level</option>
                        <option value="REACH">Reach</option>
                        <option value="STRETCH">Stretch</option>
                        <option value="STOOP">Stoop</option>
                        <option value="CUSTOM">Custom</option>
                    </select>
                </label>
                <label>Color: <input type="color" id="fixtureColor" value="#6b7280"></label>
            </div>
            <div class="property-group">
                <label>X: <input type="number" id="fixtureX" step="0.5" min="0" max="40"></label>
                <label>Y: <input type="number" id="fixtureY" step="0.5" min="0" max="30"></label>
                <label>W: <input type="number" id="fixtureWidth" step="0.5" min="0.5" max="20"></label>
                <label>H: <input type="number" id="fixtureHeight" step="0.5" min="0.5" max="15"></label>
            </div>
            <button id="applyChanges">Apply</button>
        </div>

        <div class="vm-zone-legend">
            <h4>VM Zones</h4>
            <div class="zone-item">
                <div class="zone-color" style="background-color: #10b981;"></div>
                <span><strong>Eye Level</strong> - Prime merchandising space</span>
            </div>
            <div class="zone-item">
                <div class="zone-color" style="background-color: #3b82f6;"></div>
                <span><strong>Reach Zone</strong> - Easy customer access</span>
            </div>
            <div class="zone-item">
                <div class="zone-color" style="background-color: #f59e0b;"></div>
                <span><strong>Stretch Zone</strong> - Higher placement</span>
            </div>
            <div class="zone-item">
                <div class="zone-color" style="background-color: #6b7280;"></div>
                <span><strong>Stoop Zone</strong> - Lower placement</span>
            </div>
            <div class="zone-item">
                <div class="zone-color" style="background: linear-gradient(90deg, #ef4444, #eab308, #22c55e, #3b82f6);"></div>
                <span><strong>Custom</strong> - User defined color</span>
            </div>
        </div>

        <div class="help-text">
            <strong>Usage:</strong> Select fixtures to drag/resize \u2022 Add mode to create \u2022 Double-click to edit
        </div>

        <div id="statusBar" class="status-bar">Ready</div>
    </div>

    <script>
        class PlanogramEditor {
            constructor() {
                this.canvas = document.getElementById('planogram-canvas');
                this.ctx = this.canvas.getContext('2d');
                this.SCALE = 20;

                this.fixtures = [
                    { id: '1', name: 'Premium Shelf', x: 5, y: 8, width: 8, height: 2, vmZone: 'EYE' },
                    { id: '2', name: 'Standard Shelf', x: 5, y: 12, width: 8, height: 2, vmZone: 'REACH' }
                ];

                this.gridVisible = true;
                this.snapToGrid = true;
                this.gridSize = 1;
                this.mode = 'select';
                this.selectedFixture = null;
                this.isDragging = false;
                this.isResizing = false;
                this.resizeHandle = null;
                this.dragOffset = { x: 0, y: 0 };

                this.zoneColors = {
                    EYE: '#10b981', REACH: '#3b82f6', STRETCH: '#f59e0b', STOOP: '#6b7280', CUSTOM: null
                };

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.draw();
            }

            setupEventListeners() {
                this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
                this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
                this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
                this.canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
                document.addEventListener('keydown', this.onKeyDown.bind(this));

                document.getElementById('selectMode').addEventListener('click', () => this.setMode('select'));
                document.getElementById('addMode').addEventListener('click', () => this.setMode('add'));
                document.getElementById('toggleGrid').addEventListener('click', () => this.toggleGrid());
                document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
                document.getElementById('saveData').addEventListener('click', () => this.saveData());
                document.getElementById('loadData').addEventListener('click', () => this.loadData());
                document.getElementById('deleteSelected').addEventListener('click', () => this.deleteSelected());
                document.getElementById('applyChanges').addEventListener('click', () => this.applyChanges());
                document.getElementById('snapToGrid').addEventListener('change', (e) => this.snapToGrid = e.target.checked);
                document.getElementById('gridSize').addEventListener('change', (e) => {
                    this.gridSize = parseFloat(e.target.value);
                    if (this.snapToGrid) this.draw();
                });

                ['fixtureName', 'fixtureZone', 'fixtureColor'].forEach(id => {
                    document.getElementById(id).addEventListener('input', this.onPropertyChange.bind(this));
                });
            }

            setMode(mode) {
                this.mode = mode;
                this.selectedFixture = null;
                this.hideProperties();

                document.querySelectorAll('.mode-button').forEach(btn => btn.classList.remove('active'));
                document.getElementById(mode + 'Mode').classList.add('active');
                document.getElementById('deleteSelected').disabled = true;

                this.canvas.style.cursor = mode === 'add' ? 'crosshair' : 'default';
                this.draw();
            }

            onMouseDown(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.SCALE;
                const y = (e.clientY - rect.top) / this.SCALE;

                if (this.mode === 'add') {
                    this.addFixture(x, y);
                } else if (this.mode === 'select') {
                    const fixture = this.getFixtureAt(x, y);

                    if (fixture) {
                        this.selectedFixture = fixture;
                        this.showProperties();

                        this.resizeHandle = this.getResizeHandle(fixture, x, y);

                        if (this.resizeHandle) {
                            this.isResizing = true;
                        } else {
                            this.isDragging = true;
                            this.dragOffset = { x: x - fixture.x, y: y - fixture.y };
                        }

                        document.getElementById('deleteSelected').disabled = false;
                    } else {
                        this.selectedFixture = null;
                        this.hideProperties();
                        document.getElementById('deleteSelected').disabled = true;
                    }

                    this.draw();
                }
            }

            onMouseMove(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.SCALE;
                const y = (e.clientY - rect.top) / this.SCALE;

                document.getElementById('mouseCoords').textContent =
                    'Mouse: (' + x.toFixed(1) + ', ' + y.toFixed(1) + ')';

                if (this.mode === 'select' && this.selectedFixture) {
                    if (this.isDragging) {
                        let newX = Math.max(0, Math.min(40 - this.selectedFixture.width, x - this.dragOffset.x));
                        let newY = Math.max(0, Math.min(30 - this.selectedFixture.height, y - this.dragOffset.y));

                        if (this.snapToGrid) {
                            newX = Math.round(newX / this.gridSize) * this.gridSize;
                            newY = Math.round(newY / this.gridSize) * this.gridSize;
                        }

                        this.selectedFixture.x = newX;
                        this.selectedFixture.y = newY;
                        this.updateProperties();
                        this.draw();
                    } else if (this.isResizing) {
                        this.resizeFixture(this.selectedFixture, this.resizeHandle, x, y);
                        this.updateProperties();
                        this.draw();
                    }
                }
            }

            onMouseUp(e) {
                this.isDragging = false;
                this.isResizing = false;
                this.resizeHandle = null;
            }

            onDoubleClick(e) {
                if (this.mode === 'select' && this.selectedFixture) {
                    document.getElementById('fixtureName').focus();
                }
            }

            onKeyDown(e) {
                if (e.key === 'Delete' && this.selectedFixture) {
                    this.deleteSelected();
                }
            }

            addFixture(x, y) {
                const newFixture = {
                    id: Date.now().toString(),
                    name: 'Fixture ' + (this.fixtures.length + 1),
                    x: Math.max(0, Math.min(36, x - 2)),
                    y: Math.max(0, Math.min(26, y - 2)),
                    width: 4,
                    height: 4,
                    vmZone: 'REACH'
                };

                this.fixtures.push(newFixture);
                this.selectedFixture = newFixture;
                this.showProperties();
                this.draw();
                document.getElementById('deleteSelected').disabled = false;
            }

            getFixtureAt(x, y) {
                for (let i = this.fixtures.length - 1; i >= 0; i--) {
                    const fixture = this.fixtures[i];
                    if (x >= fixture.x && x <= fixture.x + fixture.width &&
                        y >= fixture.y && y <= fixture.y + fixture.height) {
                        return fixture;
                    }
                }
                return null;
            }

            getResizeHandle(fixture, x, y) {
                const handleSize = 0.5;
                const fx = fixture.x, fy = fixture.y, fw = fixture.width, fh = fixture.height;

                if (Math.abs(x - (fx + fw)) < handleSize && Math.abs(y - (fy + fh)) < handleSize) return 'se';
                if (Math.abs(x - fx) < handleSize && Math.abs(y - fy) < handleSize) return 'nw';
                if (Math.abs(x - (fx + fw)) < handleSize && Math.abs(y - fy) < handleSize) return 'ne';
                if (Math.abs(x - fx) < handleSize && Math.abs(y - (fy + fh)) < handleSize) return 'sw';

                return null;
            }

            resizeFixture(fixture, handle, mouseX, mouseY) {
                const minSize = 0.5;

                if (this.snapToGrid) {
                    mouseX = Math.round(mouseX / this.gridSize) * this.gridSize;
                    mouseY = Math.round(mouseY / this.gridSize) * this.gridSize;
                }

                switch (handle) {
                    case 'se':
                        fixture.width = Math.max(minSize, Math.min(40 - fixture.x, mouseX - fixture.x));
                        fixture.height = Math.max(minSize, Math.min(30 - fixture.y, mouseY - fixture.y));
                        break;
                    case 'nw':
                        const newWidth = fixture.x + fixture.width - mouseX;
                        const newHeight = fixture.y + fixture.height - mouseY;
                        if (newWidth >= minSize && mouseX >= 0) {
                            fixture.width = newWidth;
                            fixture.x = mouseX;
                        }
                        if (newHeight >= minSize && mouseY >= 0) {
                            fixture.height = newHeight;
                            fixture.y = mouseY;
                        }
                        break;
                }
            }

            showProperties() {
                if (!this.selectedFixture) return;
                document.getElementById('fixtureProperties').classList.add('show');
                this.updateProperties();
            }

            updateProperties() {
                if (!this.selectedFixture) return;

                document.getElementById('fixtureName').value = this.selectedFixture.name;
                document.getElementById('fixtureZone').value = this.selectedFixture.vmZone;
                document.getElementById('fixtureX').value = this.selectedFixture.x.toFixed(1);
                document.getElementById('fixtureY').value = this.selectedFixture.y.toFixed(1);
                document.getElementById('fixtureWidth').value = this.selectedFixture.width.toFixed(1);
                document.getElementById('fixtureHeight').value = this.selectedFixture.height.toFixed(1);

                const color = this.selectedFixture.customColor || this.zoneColors[this.selectedFixture.vmZone] || '#6b7280';
                document.getElementById('fixtureColor').value = color;

                document.getElementById('selectedInfo').textContent =
                    'Selected: ' + this.selectedFixture.name;
            }

            hideProperties() {
                document.getElementById('fixtureProperties').classList.remove('show');
                document.getElementById('selectedInfo').textContent = 'No selection';
            }

            onPropertyChange() {
                if (!this.selectedFixture) return;

                this.selectedFixture.name = document.getElementById('fixtureName').value;
                this.selectedFixture.vmZone = document.getElementById('fixtureZone').value;

                if (this.selectedFixture.vmZone === 'CUSTOM') {
                    this.selectedFixture.customColor = document.getElementById('fixtureColor').value;
                } else {
                    delete this.selectedFixture.customColor;
                }

                this.draw();
            }

            applyChanges() {
                if (!this.selectedFixture) return;

                this.selectedFixture.x = Math.max(0, parseFloat(document.getElementById('fixtureX').value) || 0);
                this.selectedFixture.y = Math.max(0, parseFloat(document.getElementById('fixtureY').value) || 0);
                this.selectedFixture.width = Math.max(0.5, parseFloat(document.getElementById('fixtureWidth').value) || 1);
                this.selectedFixture.height = Math.max(0.5, parseFloat(document.getElementById('fixtureHeight').value) || 1);

                this.updateProperties();
                this.draw();
            }

            deleteSelected() {
                if (!this.selectedFixture) return;

                const index = this.fixtures.indexOf(this.selectedFixture);
                if (index > -1) {
                    this.fixtures.splice(index, 1);
                    this.selectedFixture = null;
                    this.hideProperties();
                    document.getElementById('deleteSelected').disabled = true;
                    this.draw();
                }
            }

            toggleGrid() {
                this.gridVisible = !this.gridVisible;
                this.draw();
            }

            clearAll() {
                if (confirm('Clear all fixtures?')) {
                    this.fixtures = [];
                    this.selectedFixture = null;
                    this.hideProperties();
                    document.getElementById('deleteSelected').disabled = true;
                    this.draw();
                }
            }

            saveData() {
                window.parent.postMessage({
                    type: 'planogram-save',
                    fixtures: this.fixtures
                }, '*');
            }

            loadData() {
                window.parent.postMessage({ type: 'planogram-load' }, '*');
            }

            draw() {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                if (this.gridVisible) {
                    this.ctx.strokeStyle = '#f0f0f0';
                    this.ctx.lineWidth = 0.5;

                    for (let x = 0; x <= this.canvas.width; x += this.SCALE) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, 0);
                        this.ctx.lineTo(x, this.canvas.height);
                        this.ctx.stroke();
                    }

                    for (let y = 0; y <= this.canvas.height; y += this.SCALE) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, y);
                        this.ctx.lineTo(this.canvas.width, y);
                        this.ctx.stroke();
                    }
                }

                this.ctx.strokeStyle = '#2563eb';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);

                this.ctx.fillStyle = '#1f2937';
                this.ctx.font = '14px sans-serif';
                this.ctx.fillText('Interactive Store Layout', 20, 35);

                this.fixtures.forEach(fixture => {
                    this.drawFixture(fixture, fixture === this.selectedFixture);
                });
            }

            drawFixture(fixture, isSelected) {
                const x = fixture.x * this.SCALE;
                const y = fixture.y * this.SCALE;
                const width = fixture.width * this.SCALE;
                const height = fixture.height * this.SCALE;

                const color = fixture.customColor || this.zoneColors[fixture.vmZone] || '#6b7280';
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = isSelected ? 0.8 : 0.6;
                this.ctx.fillRect(x, y, width, height);
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = isSelected ? '#dc2626' : '#374151';
                this.ctx.lineWidth = isSelected ? 2 : 1;
                this.ctx.strokeRect(x, y, width, height);

                if (isSelected) {
                    this.drawSelectionHandles(fixture);
                }

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 11px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeText(fixture.name, x + width/2, y + height/2);
                this.ctx.fillText(fixture.name, x + width/2, y + height/2);
                this.ctx.textAlign = 'start';
                this.ctx.textBaseline = 'alphabetic';
            }

            drawSelectionHandles(fixture) {
                const x = fixture.x * this.SCALE;
                const y = fixture.y * this.SCALE;
                const width = fixture.width * this.SCALE;
                const height = fixture.height * this.SCALE;
                const handleSize = 6;

                this.ctx.fillStyle = '#dc2626';
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;

                const handles = [
                    [x - handleSize/2, y - handleSize/2],
                    [x + width - handleSize/2, y - handleSize/2],
                    [x - handleSize/2, y + height - handleSize/2],
                    [x + width - handleSize/2, y + height - handleSize/2]
                ];

                handles.forEach(([hx, hy]) => {
                    this.ctx.fillRect(hx, hy, handleSize, handleSize);
                    this.ctx.strokeRect(hx, hy, handleSize, handleSize);
                });
            }
        }

        window.addEventListener('load', () => {
            const editor = new PlanogramEditor();

            window.addEventListener('message', (event) => {
                if (event.data.type === 'planogram-data') {
                    editor.fixtures = event.data.fixtures || editor.fixtures;
                    editor.draw();
                }
            });
        });
    <\/script>
</body>
</html>`,h=class extends n.ItemView{constructor(e){super(e)}getViewType(){return l}getDisplayText(){return"VM Planogram"}async onOpen(){let e=this.containerEl.children[1];e.empty();let t=e.createEl("iframe",{attr:{srcdoc:w,style:"width:100%;height:100%;border:none;"}});window.addEventListener("message",async i=>{if(i.data.type==="planogram-save")await this.saveData(i.data.fixtures);else if(i.data.type==="planogram-load"){let a=await this.loadData();t.contentWindow&&t.contentWindow.postMessage({type:"planogram-data",fixtures:a},"*")}})}async saveData(e){let t=`planograms/enhanced-planogram-${Date.now()}.json`,i=JSON.stringify({created:new Date().toISOString(),version:"enhanced",fixtures:e},null,2);try{await this.app.vault.create(t,i),new n.Notice("Enhanced planogram saved to "+t)}catch(a){new n.Notice("Failed to save planogram"),console.error(a)}}async loadData(){try{let e=this.app.vault.getMarkdownFiles().filter(u=>u.path.startsWith("planograms/")&&u.path.endsWith(".json"));if(e.length===0)return null;let t=e[e.length-1],i=await this.app.vault.read(t);return JSON.parse(i).fixtures}catch(e){return console.error("Failed to load planogram:",e),null}}async onClose(){}},r=class extends n.Plugin{constructor(){super(...arguments);d(this,"settings")}async onload(){await this.loadSettings(),this.registerView(l,t=>new h(t)),this.addCommand({id:"open-enhanced-planogram",name:"Open Enhanced Planogram Canvas",callback:()=>{this.activateView()}}),this.addRibbonIcon("layout","Enhanced VM Planogram",()=>{this.activateView()}),this.addSettingTab(new c(this.app,this))}async activateView(){await this.app.workspace.getLeaf(!0).setViewState({type:l,active:!0})}onunload(){}async loadSettings(){this.settings=Object.assign({},b,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},c=class extends n.PluginSettingTab{constructor(t,i){super(t,i);d(this,"plugin");this.plugin=i}display(){let{containerEl:t}=this;t.empty(),t.createEl("h2",{text:"Enhanced VM Planogram Settings"}),new n.Setting(t).setName("Default Store Width").setDesc("Default width of store in feet").addText(i=>i.setPlaceholder("40").setValue(this.plugin.settings.defaultStoreWidth.toString()).onChange(async a=>{this.plugin.settings.defaultStoreWidth=parseInt(a)||40,await this.plugin.saveSettings()})),new n.Setting(t).setName("Default Store Height").setDesc("Default height of store in feet").addText(i=>i.setPlaceholder("30").setValue(this.plugin.settings.defaultStoreHeight.toString()).onChange(async a=>{this.plugin.settings.defaultStoreHeight=parseInt(a)||30,await this.plugin.saveSettings()})),new n.Setting(t).setName("Auto-save").setDesc("Automatically save planogram changes").addToggle(i=>i.setValue(this.plugin.settings.autoSave).onChange(async a=>{this.plugin.settings.autoSave=a,await this.plugin.saveSettings()}))}};
