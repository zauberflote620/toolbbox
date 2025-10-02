import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { requireAuth } from './auth.routes.js';

const router = express.Router();

const validateInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input', details: errors.array() });
  }
  next();
};

router.use(requireAuth);

router.get('/',
  [query('storeId').optional().isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { storeId } = req.query;

      const where: any = { createdBy: req.user!.id };
      if (storeId) {
        where.storeId = storeId;
      }

      const planograms = await req.prisma.planogram.findMany({
        where,
        include: {
          store: {
            select: { id: true, name: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json({ data: planograms });
    } catch (error) {
      console.error('Get planograms error:', error);
      res.status(500).json({ error: 'Failed to fetch planograms' });
    }
  }
);

router.get('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const planogram = await req.prisma.planogram.findFirst({
        where: {
          id: req.params.id,
          createdBy: req.user!.id
        },
        include: {
          store: true,
          executionTasks: true,
          pickLists: true
        }
      });

      if (!planogram) {
        return res.status(404).json({ error: 'Planogram not found' });
      }

      res.json({ data: planogram });
    } catch (error) {
      console.error('Get planogram error:', error);
      res.status(500).json({ error: 'Failed to fetch planogram' });
    }
  }
);

router.post('/',
  [
    body('storeId').isUUID(),
    body('name').trim().isLength({ min: 1, max: 255 }),
    body('analyticsInput').optional().isString(),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { storeId, name, analyticsInput } = req.body;

      const store = await req.prisma.store.findFirst({
        where: {
          id: storeId,
          createdBy: req.user!.id
        }
      });

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const planogram = await req.prisma.planogram.create({
        data: {
          storeId,
          name,
          analyticsInput,
          createdBy: req.user!.id,
          parsedInsights: [],
          layoutData: {}
        },
        include: {
          store: {
            select: { id: true, name: true }
          }
        }
      });

      res.status(201).json({
        message: 'Planogram created successfully',
        data: planogram
      });
    } catch (error) {
      console.error('Create planogram error:', error);
      res.status(500).json({ error: 'Failed to create planogram' });
    }
  }
);

router.put('/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 255 }),
    body('analyticsInput').optional().isString(),
    body('status').optional().isIn(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'IN_EXECUTION', 'COMPLETED', 'ARCHIVED']),
    body('layoutData').optional().isObject(),
    body('notes').optional().isString(),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const planogramId = req.params.id;
      const updateData = req.body;

      const existingPlanogram = await req.prisma.planogram.findFirst({
        where: {
          id: planogramId,
          createdBy: req.user!.id
        }
      });

      if (!existingPlanogram) {
        return res.status(404).json({ error: 'Planogram not found' });
      }

      const updatedPlanogram = await req.prisma.planogram.update({
        where: { id: planogramId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          store: {
            select: { id: true, name: true }
          }
        }
      });

      res.json({
        message: 'Planogram updated successfully',
        data: updatedPlanogram
      });
    } catch (error) {
      console.error('Update planogram error:', error);
      res.status(500).json({ error: 'Failed to update planogram' });
    }
  }
);

router.delete('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const planogramId = req.params.id;

      const existingPlanogram = await req.prisma.planogram.findFirst({
        where: {
          id: planogramId,
          createdBy: req.user!.id
        }
      });

      if (!existingPlanogram) {
        return res.status(404).json({ error: 'Planogram not found' });
      }

      await req.prisma.planogram.delete({
        where: { id: planogramId }
      });

      res.json({ message: 'Planogram deleted successfully' });
    } catch (error) {
      console.error('Delete planogram error:', error);
      res.status(500).json({ error: 'Failed to delete planogram' });
    }
  }
);

export default router;