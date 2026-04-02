# 📁 Flights - Project Structure

*Generated on: 4/1/2026, 8:11:05 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 1770 |
| 📁 Total Folders | 236 |
| 🌳 Max Depth | 10 levels |
| 🛠️ Tech Stack | React, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🔴 📖 **README.md** - Project documentation

## 📊 File Statistics

### By File Type

- 📄 **.py** (Other files): 1413 files (79.8%)
- 📄 **.** (Other files): 147 files (8.3%)
- 📄 **.txt** (Text files): 31 files (1.8%)
- 📄 **.typed** (Other files): 27 files (1.5%)
- 📄 **.pxd** (Other files): 27 files (1.5%)
- 📄 **.pyx** (Other files): 25 files (1.4%)
- 🔷 **.ts** (TypeScript files): 24 files (1.4%)
- ⚛️ **.tsx** (React TypeScript files): 22 files (1.2%)
- 📖 **.md** (Markdown files): 12 files (0.7%)
- ⚙️ **.json** (JSON files): 9 files (0.5%)
- 📄 **.so** (Other files): 7 files (0.4%)
- 📄 **.pyi** (Other files): 7 files (0.4%)
- 🎨 **.svg** (SVG images): 4 files (0.2%)
- 🎨 **.css** (Stylesheets): 2 files (0.1%)
- 📄 **.pem** (Other files): 2 files (0.1%)
- 📄 **.pxi** (Other files): 2 files (0.1%)
- 📄 **.example** (Other files): 1 files (0.1%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.1%)
- 📜 **.js** (JavaScript files): 1 files (0.1%)
- 🌐 **.html** (HTML files): 1 files (0.1%)
- 🖼️ **.png** (PNG images): 1 files (0.1%)
- 📄 **.apache** (Other files): 1 files (0.1%)
- 📄 **.bsd** (Other files): 1 files (0.1%)
- 📄 **.c** (Other files): 1 files (0.1%)
- 📄 **.cfg** (Other files): 1 files (0.1%)

### By Category

- **Other**: 1662 files (93.9%)
- **Docs**: 43 files (2.4%)
- **TypeScript**: 24 files (1.4%)
- **React**: 22 files (1.2%)
- **Config**: 9 files (0.5%)
- **Assets**: 5 files (0.3%)
- **Styles**: 2 files (0.1%)
- **DevOps**: 1 files (0.1%)
- **JavaScript**: 1 files (0.1%)
- **Web**: 1 files (0.1%)

### 📁 Largest Directories

- **root**: 1770 files
- **server**: 1702 files
- **server/.venv**: 1681 files
- **server/.venv/lib/python3.12/site-packages**: 1679 files
- **server/.venv/lib/python3.12**: 1679 files

## 🌳 Directory Structure

```
Flights/
├── 📂 .vite/
│   └── 📂 deps/
│   │   ├── ⚙️ _metadata.json
│   │   └── 🔴 📦 **package.json**
├── 📂 client/
│   ├── 📄 .env.example
│   ├── 🟡 🚫 **.gitignore**
│   ├── 📂 .vite/
│   │   └── 📂 deps/
│   │   │   ├── ⚙️ _metadata.json
│   │   │   └── 🔴 📦 **package.json**
│   ├── 📜 eslint.config.js
│   ├── 🌐 index.html
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 🌐 public/
│   │   ├── 🎨 favicon.svg
│   │   └── 🎨 icons.svg
│   ├── 🔴 📖 **README.md**
│   ├── 📁 src/
│   │   ├── 🎨 App.css
│   │   ├── ⚛️ App.tsx
│   │   ├── 📦 assets/
│   │   │   ├── 🖼️ hero.png
│   │   │   ├── 🎨 react.svg
│   │   │   └── 🎨 vite.svg
│   │   ├── 📂 Chat/
│   │   │   ├── ⚛️ App.tsx
│   │   │   ├── 🧩 components/
│   │   │   │   ├── ⚛️ ChatInput.tsx
│   │   │   │   ├── ⚛️ ChatTopbar.tsx
│   │   │   │   ├── ⚛️ FlightCard.tsx
│   │   │   │   ├── ⚛️ MessageBubble.tsx
│   │   │   │   ├── ⚛️ MessageList.tsx
│   │   │   │   └── ⚛️ Sidebar.tsx
│   │   │   ├── 📂 data/
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 🎣 hooks/
│   │   │   │   ├── 🔷 useChat.ts
│   │   │   │   ├── 🔷 useTelemetry.ts
│   │   │   │   └── 🔷 useTheme.ts
│   │   │   ├── 📂 services/
│   │   │   │   └── 🔷 api.ts
│   │   │   ├── 🎨 styles/
│   │   │   │   └── 🔷 globalStyles.ts
│   │   │   └── 📂 types/
│   │   │   │   └── 🔷 index.ts
│   │   ├── 🎨 index.css
│   │   ├── ⚛️ main.tsx
│   │   ├── 📂 Resource/
│   │   │   ├── ⚛️ App.tsx
│   │   │   ├── 🧩 components/
│   │   │   │   ├── ⚛️ GateNode.tsx
│   │   │   │   ├── ⚛️ GraphCanvas.tsx
│   │   │   │   ├── ⚛️ GraphHeader.tsx
│   │   │   │   ├── ⚛️ LayerControls.tsx
│   │   │   │   ├── ⚛️ NodeDetailPanel.tsx
│   │   │   │   ├── 🔷 nodeTypes.ts
│   │   │   │   └── ⚛️ StandNode.tsx
│   │   │   ├── 📂 data/
│   │   │   │   └── 🔷 mockData.ts
│   │   │   ├── 🎣 hooks/
│   │   │   │   ├── 🔷 useDisplayGraph.ts
│   │   │   │   ├── 🔷 useGraphHighlight.ts
│   │   │   │   └── 🔷 useLayerVisibility.ts
│   │   │   ├── 🎨 styles/
│   │   │   │   └── 🔷 globalStyles.ts
│   │   │   ├── 📂 types/
│   │   │   │   └── 🔷 index.ts
│   │   │   └── 🔧 utils/
│   │   │   │   └── 🔷 graphTransformer.ts
│   │   └── 📂 Timeline/
│   │   │   ├── ⚛️ App.tsx
│   │   │   ├── 🧩 components/
│   │   │   │   ├── ⚛️ Appheader.tsx
│   │   │   │   ├── ⚛️ Flightblock.tsx
│   │   │   │   ├── ⚛️ Flighttooltip.tsx
│   │   │   │   ├── ⚛️ Gnatt.tsx
│   │   │   │   └── ⚛️ metricCard.tsx
│   │   │   ├── 📂 data/
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 🎣 hooks/
│   │   │   │   ├── 🔷 useCounterAnimation.ts
│   │   │   │   ├── 🔷 useFlights.ts
│   │   │   │   ├── 🔷 useTimeline.ts
│   │   │   │   └── 🔷 useTooltip.ts
│   │   │   ├── 🎨 styles/
│   │   │   │   └── 🔷 globalStyles.ts
│   │   │   ├── 📂 types/
│   │   │   │   └── 🔷 index.ts
│   │   │   └── 🔧 utils/
│   │   │   │   └── 🔷 index.ts
│   ├── ⚙️ tsconfig.app.json
│   ├── 🟡 🔷 **tsconfig.json**
│   ├── ⚙️ tsconfig.node.json
│   └── 🔷 vite.config.ts
├── 🔴 📖 **README.md**
└── 📂 server/
│   
│   ├── 🚀 app/
│   │   ├── 📄 __init__.py
│   │   ├── 🔌 api/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📂 routes/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 flights.py
│   │   │   │   └── 📄 stands.py
│   │   ├── 📂 core/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 constants.py
│   │   │   ├── 📄 dependencies.py
│   │   │   └── 📄 exceptions.py
│   │   ├── 📂 data/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📄 mock_data.py
│   │   ├── 📄 main.py
│   │   ├── 📂 schemas/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📄 schemas.py
│   │   └── 📂 services/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 flight_service.py
│   │   │   └── 📄 stand_service.py
│   ├── 🔴 📖 **README.md**
│   ├── 📄 requirements.txt
│   └── 🧪 tests/
│   │   ├── 📄 __init__.py
│   │   └── 📄 test_api.py
```

## 📖 Legend

### File Types
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- 📄 Other: Other files
- 🚫 DevOps: Git ignore
- 📜 JavaScript: JavaScript files
- 🌐 Web: HTML files
- 🎨 Assets: SVG images
- 🎨 Styles: Stylesheets
- ⚛️ React: React TypeScript files
- 🔷 TypeScript: TypeScript files
- 🖼️ Assets: PNG images
- 📄 Docs: Text files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
