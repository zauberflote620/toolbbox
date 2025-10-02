import express from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth } from './auth.routes.js';
import { AnalyticsService } from '../services/analytics.service.js';

const router = express.Router();
const analyticsService = new AnalyticsService();

const validateInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input', details: errors.array() });
  }
  next();
};

router.use(requireAuth);

router.post('/parse',
  [
    body('text').trim().isLength({ min: 10, max: 10000 }),
    body('storeId').optional().isUUID(),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { text, storeId } = req.body;

      const insights = analyticsService.parseAnalyticsText(text);

      res.json({
        data: {
          originalText: text,
          insights,
          confidence: insights.reduce((acc, insight) => acc + insight.confidence, 0) / insights.length || 0
        }
      });
    } catch (error) {
      console.error('Parse analytics error:', error);
      res.status(500).json({ error: 'Failed to parse analytics text' });
    }
  }
);

router.post('/generate-rules',
  [
    body('insights').isArray().notEmpty(),
    body('storeId').isUUID(),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { insights, storeId } = req.body;

      const store = await req.prisma.store.findFirst({
        where: {
          id: storeId,
          createdBy: req.user!.id
        }
      });

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const placementRules = analyticsService.generatePlacementRules(insights);

      res.json({
        data: {
          rules: placementRules,
          storeId,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Generate rules error:', error);
      res.status(500).json({ error: 'Failed to generate placement rules' });
    }
  }
);

export default router;