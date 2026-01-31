# General Manager

A Claude Cowork plugin suite for managing businesses with AI-powered insights and automation.

## Available Plugins

| Plugin | Description |
|--------|-------------|
| [**saas**](./saas) | Manage SaaS growth with analysis of ads, content, funnels, and metrics |

## Installation

Install plugins via Claude Cowork marketplace, or clone this repository:

```bash
git clone https://github.com/your-org/general-manager.git
```

## Plugin Structure

Each plugin follows the Claude Cowork plugin standard:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json       # Plugin metadata
├── commands/             # User-invocable slash commands
│   └── command-name.md
├── skills/               # Auto-invoked background skills
│   └── skill-name/
│       └── SKILL.md
├── .mcp.json             # MCP connector configuration
├── CONNECTORS.md         # Connector documentation
└── README.md
```

## Future Plugins

- **restaurant** — Restaurant operations (menu, inventory, scheduling, reservations)
- **retail** — Retail/e-commerce (product management, inventory, customer analytics)
- **professional-services** — Services businesses (projects, clients, time tracking)

## Contributing

See individual plugin READMEs for contribution guidelines.

## License

MIT
