import express from 'express';
import { body, param, validationResult } from 'express-validator';
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

router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const stores = await req.prisma.store.findMany({
      where: { createdBy: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { planograms: true }
        }
      }
    });

    res.json({ data: stores });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

router.get('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const store = await req.prisma.store.findFirst({
        where: {
          id: req.params.id,
          createdBy: req.user!.id
        },
        include: {
          storeFixtures: {
            include: {
              fixture: true,
              productPlacements: {
                include: {
                  product: true
                }
              }
            }
          },
          planograms: {
            orderBy: { version: 'desc' },
            take: 5
          }
        }
      });

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      res.json({ data: store });
    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({ error: 'Failed to fetch store' });
    }
  }
);

router.post('/',
  [
    body('name').trim().isLength({ min: 1, max: 255 }),
    body('address').optional().trim().isLength({ max: 500 }),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('storeNumber').optional().trim().isLength({ max: 50 }),
    body('dimensions.width').isFloat({ min: 0.1 }),
    body('dimensions.height').isFloat({ min: 0.1 }),
    body('dimensions.ceilingHeight').isFloat({ min: 0.1 }),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { name, address, phone, storeNumber, dimensions, constraints, trafficPatterns } = req.body;

      const store = await req.prisma.store.create({
        data: {
          name,
          address,
          phone,
          storeNumber,
          dimensions,
          constraints: constraints || {},
          trafficPatterns: trafficPatterns || [],
          createdBy: req.user!.id
        }
      });

      res.status(201).json({
        message: 'Store created successfully',
        data: store
      });
    } catch (error) {
      console.error('Create store error:', error);
      res.status(500).json({ error: 'Failed to create store' });
    }
  }
);

router.put('/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 255 }),
    body('address').optional().trim().isLength({ max: 500 }),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('dimensions.width').optional().isFloat({ min: 0.1 }),
    body('dimensions.height').optional().isFloat({ min: 0.1 }),
    body('dimensions.ceilingHeight').optional().isFloat({ min: 0.1 }),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const storeId = req.params.id;
      const updateData = req.body;

      const existingStore = await req.prisma.store.findFirst({
        where: {
          id: storeId,
          createdBy: req.user!.id
        }
      });

      if (!existingStore) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const updatedStore = await req.prisma.store.update({
        where: { id: storeId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      res.json({
        message: 'Store updated successfully',
        data: updatedStore
      });
    } catch (error) {
      console.error('Update store error:', error);
      res.status(500).json({ error: 'Failed to update store' });
    }
  }
);

router.delete('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const storeId = req.params.id;

      const existingStore = await req.prisma.store.findFirst({
        where: {
          id: storeId,
          createdBy: req.user!.id
        }
      });

      if (!existingStore) {
        return res.status(404).json({ error: 'Store not found' });
      }

      await req.prisma.store.delete({
        where: { id: storeId }
      });

      res.json({ message: 'Store deleted successfully' });
    } catch (error) {
      console.error('Delete store error:', error);
      res.status(500).json({ error: 'Failed to delete store' });
    }
  }
);

export default router;