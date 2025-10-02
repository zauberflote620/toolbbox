import { App, TFile } from 'obsidian';

export interface PlanogramData {
    id: string;
    name: string;
    storeName?: string;
    storeAddress?: string;
    storeFormat?: string;
    created: string;
    modified?: string;
    fixtures: any[];
    insights?: any[];
    vmStrategy?: string;
}

export class DataSync {
    constructor(private app: App) {}

    async syncPlanogram(data: PlanogramData) {
        const fileName = `planograms/${data.id || Date.now()}.md`;
        const content = this.generateMarkdown(data);

        let file = this.app.vault.getAbstractFileByPath(fileName);
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
        } else {
            // Ensure directory exists
            const dir = this.app.vault.getAbstractFileByPath('planograms');
            if (!dir) {
                await this.app.vault.createFolder('planograms');
            }
            await this.app.vault.create(fileName, content);
        }

        return fileName;
    }

    generateMarkdown(data: PlanogramData): string {
        const frontmatter = [
            '---',
            `id: ${data.id}`,
            `name: ${data.name || 'Unnamed Planogram'}`,
            `store: ${data.storeName || 'Unknown Store'}`,
            `created: ${data.created}`,
            `modified: ${data.modified || new Date().toISOString()}`,
            `fixtures_count: ${data.fixtures?.length || 0}`,
            `vm_strategy: ${data.vmStrategy || 'anchor-and-spokes'}`,
            '---'
        ].join('\n');

        const content = [
            frontmatter,
            '',
            `# Planogram: ${data.name || 'Unnamed'}`,
            '',
            '## Store Details',
            `- **Store Name**: ${data.storeName || 'Not specified'}`,
            `- **Location**: ${data.storeAddress || 'Not specified'}`,
            `- **Format**: ${data.storeFormat || 'Standard'}`,
            `- **Created**: ${new Date(data.created).toLocaleDateString()}`,
            '',
            '## VM Strategy',
            `Using the **${data.vmStrategy || 'Anchor-and-Spokes'}** methodology:`,
            '- Anchors positioned in high-traffic zones',
            '- Spokes clustered around anchor points',
            '- Natural customer flow patterns',
            '',
            '## Fixtures',
            data.fixtures && data.fixtures.length > 0 ?
                this.generateFixtureTable(data.fixtures) :
                '*No fixtures configured*',
            '',
            '## VM Zone Distribution',
            this.generateZoneAnalysis(data.fixtures),
            '',
            '## Analytics Insights',
            data.insights && data.insights.length > 0 ?
                data.insights.map(i => `- **${i.type}**: ${i.description}`).join('\n') :
                '*No insights available*'
        ].join('\n');

        return content;
    }

    generateFixtureTable(fixtures: any[]): string {
        const header = '| Fixture | Type | VM Zone | Position | Size |';
        const separator = '|---------|------|---------|----------|------|';

        const rows = fixtures.map(f => {
            const zone = f.vmZone || 'UNASSIGNED';
            const position = `(${Math.round(f.x)}, ${Math.round(f.y)})`;
            const size = `${Math.round(f.width)}x${Math.round(f.height)}`;
            return `| ${f.name} | ${f.type || 'Shelf'} | ${zone} | ${position} | ${size} |`;
        });

        return [header, separator, ...rows].join('\n');
    }

    generateZoneAnalysis(fixtures: any[]): string {
        if (!fixtures || fixtures.length === 0) {
            return '*No fixtures to analyze*';
        }

        const zones = { EYE: 0, REACH: 0, STRETCH: 0, STOOP: 0 };
        fixtures.forEach(f => {
            if (f.vmZone && zones.hasOwnProperty(f.vmZone)) {
                zones[f.vmZone as keyof typeof zones]++;
            }
        });

        const total = fixtures.length;
        return [
            '```mermaid',
            'pie title VM Zone Distribution',
            ...Object.entries(zones)
                .filter(([_, count]) => count > 0)
                .map(([zone, count]) => `    "${zone}" : ${count}`),
            '```',
            '',
            '### Zone Percentages',
            ...Object.entries(zones)
                .filter(([_, count]) => count > 0)
                .map(([zone, count]) => `- **${zone}**: ${Math.round((count/total) * 100)}% (${count} fixtures)`)
        ].join('\n');
    }

    async loadPlanogram(id: string): Promise<PlanogramData | null> {
        const fileName = `planograms/${id}.md`;
        const file = this.app.vault.getAbstractFileByPath(fileName);

        if (file instanceof TFile) {
            const content = await this.app.vault.read(file);
            return this.parseMarkdown(content);
        }

        return null;
    }

    parseMarkdown(content: string): PlanogramData | null {
        const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
        if (!frontmatterMatch) return null;

        const frontmatter = frontmatterMatch[1];
        const data: Partial<PlanogramData> = {
            fixtures: []
        };

        // Parse frontmatter
        frontmatter.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value) {
                switch(key) {
                    case 'id': data.id = value; break;
                    case 'name': data.name = value; break;
                    case 'store': data.storeName = value; break;
                    case 'created': data.created = value; break;
                    case 'modified': data.modified = value; break;
                    case 'vm_strategy': data.vmStrategy = value; break;
                }
            }
        });

        // Parse fixtures table if present
        const tableMatch = content.match(/\| Fixture[\s\S]+?\n\n/);
        if (tableMatch) {
            const lines = tableMatch[0].split('\n').slice(2); // Skip header and separator
            lines.forEach(line => {
                if (line.startsWith('|')) {
                    const parts = line.split('|').map(s => s.trim()).filter(s => s);
                    if (parts.length >= 5) {
                        const posMatch = parts[3].match(/\((\d+),\s*(\d+)\)/);
                        const sizeMatch = parts[4].match(/(\d+)x(\d+)/);

                        data.fixtures?.push({
                            name: parts[0],
                            type: parts[1],
                            vmZone: parts[2],
                            x: posMatch ? parseInt(posMatch[1]) : 0,
                            y: posMatch ? parseInt(posMatch[2]) : 0,
                            width: sizeMatch ? parseInt(sizeMatch[1]) : 2,
                            height: sizeMatch ? parseInt(sizeMatch[2]) : 1
                        });
                    }
                }
            });
        }

        return data as PlanogramData;
    }

    async listPlanograms(): Promise<PlanogramData[]> {
        const folder = this.app.vault.getAbstractFileByPath('planograms');
        if (!folder) {
            await this.app.vault.createFolder('planograms');
            return [];
        }

        const files = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('planograms/'));

        const planograms: PlanogramData[] = [];
        for (const file of files) {
            const content = await this.app.vault.read(file);
            const data = this.parseMarkdown(content);
            if (data) {
                planograms.push(data);
            }
        }

        return planograms;
    }
}