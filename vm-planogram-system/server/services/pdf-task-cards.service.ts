import puppeteer from 'puppeteer';
import { Planogram, Store } from '@prisma/client';

export class TaskCardsPDFService {
  static async generateTaskCardsPDF(
    planogram: Planogram & { store: Store }
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 1200 });

      // Generate task cards from planogram data
      const taskCards = this.generateTaskCardsFromPlanogram(planogram);
      const html = this.generateTaskCardsHTML(planogram, taskCards);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      return await page.pdf({
        format: 'letter',
        margin: {
          top: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
          right: '0.5in'
        },
        printBackground: true
      });
    } finally {
      await browser.close();
    }
  }

  private static generateTaskCardsFromPlanogram(planogram: Planogram & { store: Store }): any[] {
    const layoutData = planogram.layoutData as any;
    const fixtures = layoutData?.fixtures || [];
    const taskCards: any[] = [];

    // Add general reset tasks
    taskCards.push({
      title: 'Prepare Store for Reset',
      description: 'Initial preparation and safety setup',
      type: 'preparation',
      priority: 'high',
      estimatedTime: '30 min',
      steps: [
        'Review complete planogram',
        'Set up safety barriers if needed',
        'Gather required tools and equipment',
        'Take before photos',
        'Clear main walkways',
        'Brief team on safety procedures'
      ]
    });

    // Generate fixture placement tasks
    fixtures.forEach((storeFixture: any, index: number) => {
      const fixture = storeFixture.fixture;
      if (!fixture) return;

      taskCards.push({
        title: `Place ${fixture.name}`,
        description: `Position fixture according to planogram specifications`,
        type: 'fixture_placement',
        priority: storeFixture.vmZone === 'EYE' ? 'high' : 'medium',
        estimatedTime: '20 min',
        fixtureInfo: {
          name: fixture.name,
          sku: fixture.ulineSku,
          dimensions: fixture.dimensions
        },
        targetLocation: `${storeFixture.x}', ${storeFixture.y}' (${storeFixture.vmZone} Zone)`,
        vmZone: storeFixture.vmZone,
        safetyNotes: fixture.dimensions.weight > 100 ? 'Heavy item - use proper lifting technique or team lift' : undefined,
        steps: [
          'Verify fixture location on planogram',
          'Clear the designated area',
          'Assemble fixture if required',
          'Position fixture at coordinates specified',
          'Ensure proper alignment with grid',
          'Verify stability and safety',
          'Check VM zone compliance'
        ]
      });
    });

    taskCards.push({
      title: 'Final Quality Check',
      description: 'Complete final inspection and documentation',
      type: 'quality_check',
      priority: 'high',
      estimatedTime: '15 min',
      steps: [
        'Compare layout to planogram',
        'Check all fixture stability',
        'Verify VM zone compliance',
        'Take after photos',
        'Clean up work area',
        'Complete sign-off documentation'
      ]
    });

    return taskCards;
  }

  private static generateTaskCardsHTML(
    planogram: Planogram & { store: Store },
    taskCards: any[]
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Task Cards - ${planogram.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
          }
          .header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          .task-card {
            border: 2px solid #333;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 15px;
            page-break-inside: avoid;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            padding: 10px;
            margin: -15px -15px 15px -15px;
            border-radius: 6px 6px 0 0;
          }
          .task-id {
            font-weight: bold;
            font-size: 14px;
            color: #2563eb;
          }
          .priority-high { border-left: 5px solid #dc2626; }
          .priority-medium { border-left: 5px solid #f59e0b; }
          .priority-low { border-left: 5px solid #10b981; }
          .task-details { margin: 10px 0; }
          .task-details h4 {
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 13px;
          }
          .task-steps {
            background: #f8fafc;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
          }
          .task-steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .task-steps li {
            margin: 5px 0;
            line-height: 1.4;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
          }
          .signature-box {
            width: 200px;
            border-bottom: 1px solid #333;
            text-align: center;
            padding-bottom: 5px;
          }
          .notes-section {
            margin-top: 15px;
            padding: 10px;
            background: #fffbeb;
            border-radius: 4px;
            border: 1px solid #fbbf24;
          }
          .fixture-info {
            background: #ecfdf5;
            padding: 8px;
            border-radius: 4px;
            margin: 8px 0;
            border-left: 3px solid #10b981;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Task Cards - ${planogram.name}</h1>
          <p>Store: ${planogram.store.name} | Generated: ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Tasks:</strong> ${taskCards.length} | <strong>Store Dimensions:</strong> ${planogram.store.dimensions.width}' × ${planogram.store.dimensions.height}'</p>
        </div>

        ${taskCards.map((task, index) => `
          <div class="task-card priority-${task.priority || 'medium'}">
            <div class="task-header">
              <div class="task-id">Task #${(index + 1).toString().padStart(3, '0')}</div>
              <div style="text-align: right;">
                <strong>Priority:</strong> ${(task.priority || 'medium').toUpperCase()}<br>
                <strong>Estimated Time:</strong> ${task.estimatedTime || '15 min'}
              </div>
            </div>

            <div class="task-details">
              <h4>Task: ${task.title}</h4>
              <p><strong>Description:</strong> ${task.description}</p>

              ${task.fixtureInfo ? `
                <div class="fixture-info">
                  <strong>Fixture:</strong> ${task.fixtureInfo.name}<br>
                  <strong>SKU:</strong> ${task.fixtureInfo.sku || 'N/A'}<br>
                  <strong>Dimensions:</strong> ${task.fixtureInfo.dimensions?.width || 0}" × ${task.fixtureInfo.dimensions?.depth || 0}" × ${task.fixtureInfo.dimensions?.height || 0}"<br>
                  <strong>Target Location:</strong> ${task.targetLocation || 'See planogram'}
                </div>
              ` : ''}

              <div class="task-steps">
                <strong>Steps to Complete:</strong>
                <ol>
                  ${task.steps.map((step: string) => `<li>${step}</li>`).join('')}
                </ol>
              </div>

              ${task.safetyNotes ? `
                <div style="background: #fef2f2; padding: 8px; border-radius: 4px; border-left: 3px solid #dc2626; margin: 8px 0;">
                  <strong>⚠️ Safety Notes:</strong> ${task.safetyNotes}
                </div>
              ` : ''}

              ${task.vmZone ? `
                <p><strong>VM Zone:</strong> ${this.getVMZoneDescription(task.vmZone)}</p>
              ` : ''}
            </div>

            <div class="signature-section">
              <div>
                <strong>Assigned To:</strong><br>
                <div class="signature-box">_________________</div>
                <small>Print Name</small>
              </div>
              <div>
                <strong>Completed By:</strong><br>
                <div class="signature-box">_________________</div>
                <small>Signature & Date</small>
              </div>
            </div>

            <div class="notes-section">
              <strong>Notes / Issues:</strong><br>
              <div style="height: 40px; margin-top: 5px;"></div>
            </div>
          </div>
        `).join('')}

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 10px;">
          <p>Generated by VM Planogram System | ${new Date().toISOString()}</p>
          <p>All tasks should be completed following company safety guidelines and VM standards</p>
        </div>
      </body>
      </html>
    `;
  }

  private static getVMZoneDescription(zone: string): string {
    const descriptions = {
      'EYE': 'Eye Level (60-72") - Prime real estate for high-margin and bestselling items',
      'REACH': 'Reach Zone (48-60") - Easily accessible area for everyday items',
      'STRETCH': 'Stretch Zone (72"+) - Upper area for aspirational or seasonal displays',
      'STOOP': 'Stoop Zone (0-48") - Lower area for bulk items, storage, or clearance'
    };
    return descriptions[zone as keyof typeof descriptions] || zone;
  }
}