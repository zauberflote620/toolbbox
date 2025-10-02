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
  [
    query('category').optional().isString(),
    query('search').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const { category, search, limit = 50, offset = 0 } = req.query;

      const where: any = {};
      if (category) {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { ulineSku: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [fixtures, total] = await Promise.all([
        req.prisma.fixture.findMany({
          where,
          skip: Number(offset),
          take: Number(limit),
          orderBy: { name: 'asc' },
        }),
        req.prisma.fixture.count({ where }),
      ]);

      res.json({
        data: fixtures,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total,
        },
      });
    } catch (error) {
      console.error('Get fixtures error:', error);
      res.status(500).json({ error: 'Failed to fetch fixtures' });
    }
  }
);

router.get('/categories', async (req: express.Request, res: express.Response) => {
  try {
    const categories = await req.prisma.fixture.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { category: 'asc' },
    });

    res.json({
      data: categories.map(cat => ({
        name: cat.category,
        count: cat._count._all,
      })),
    });
  } catch (error) {
    console.error('Get fixture categories error:', error);
    res.status(500).json({ error: 'Failed to fetch fixture categories' });
  }
});

router.get('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const fixture = await req.prisma.fixture.findUnique({
        where: { id: req.params.id },
        include: {
          storeFixtures: {
            include: {
              store: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      if (!fixture) {
        return res.status(404).json({ error: 'Fixture not found' });
      }

      res.json({ data: fixture });
    } catch (error) {
      console.error('Get fixture error:', error);
      res.status(500).json({ error: 'Failed to fetch fixture' });
    }
  }
);

router.post('/',
  [
    body('name').trim().isLength({ min: 1, max: 255 }),
    body('category').trim().isLength({ min: 1, max: 100 }),
    body('subcategory').optional().trim().isLength({ max: 100 }),
    body('dimensions.width').isFloat({ min: 0.1 }),
    body('dimensions.depth').isFloat({ min: 0.1 }),
    body('dimensions.height').isFloat({ min: 0.1 }),
    body('capacity.units').optional().isInt({ min: 0 }),
    body('capacity.weight').optional().isFloat({ min: 0 }),
    body('material').optional().trim().isLength({ max: 100 }),
    body('color').optional().trim().isLength({ max: 50 }),
    body('priceCents').optional().isInt({ min: 0 }),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const fixtureData = {
        ...req.body,
        isCustom: true,
      };

      const fixture = await req.prisma.fixture.create({
        data: fixtureData,
      });

      res.status(201).json({
        message: 'Custom fixture created successfully',
        data: fixture,
      });
    } catch (error) {
      console.error('Create fixture error:', error);
      res.status(500).json({ error: 'Failed to create fixture' });
    }
  }
);

router.put('/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 255 }),
    body('category').optional().trim().isLength({ min: 1, max: 100 }),
    body('dimensions.width').optional().isFloat({ min: 0.1 }),
    body('dimensions.depth').optional().isFloat({ min: 0.1 }),
    body('dimensions.height').optional().isFloat({ min: 0.1 }),
  ],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const fixtureId = req.params.id;

      const existingFixture = await req.prisma.fixture.findUnique({
        where: { id: fixtureId },
      });

      if (!existingFixture) {
        return res.status(404).json({ error: 'Fixture not found' });
      }

      if (!existingFixture.isCustom) {
        return res.status(400).json({ error: 'Cannot edit Uline catalog fixtures' });
      }

      const updatedFixture = await req.prisma.fixture.update({
        where: { id: fixtureId },
        data: req.body,
      });

      res.json({
        message: 'Fixture updated successfully',
        data: updatedFixture,
      });
    } catch (error) {
      console.error('Update fixture error:', error);
      res.status(500).json({ error: 'Failed to update fixture' });
    }
  }
);

router.delete('/:id',
  [param('id').isUUID()],
  validateInput,
  async (req: express.Request, res: express.Response) => {
    try {
      const fixtureId = req.params.id;

      const existingFixture = await req.prisma.fixture.findUnique({
        where: { id: fixtureId },
        include: {
          storeFixtures: true,
        },
      });

      if (!existingFixture) {
        return res.status(404).json({ error: 'Fixture not found' });
      }

      if (!existingFixture.isCustom) {
        return res.status(400).json({ error: 'Cannot delete Uline catalog fixtures' });
      }

      if (existingFixture.storeFixtures.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete fixture that is used in store layouts',
        });
      }

      await req.prisma.fixture.delete({
        where: { id: fixtureId },
      });

      res.json({ message: 'Fixture deleted successfully' });
    } catch (error) {
      console.error('Delete fixture error:', error);
      res.status(500).json({ error: 'Failed to delete fixture' });
    }
  }
);

export default router;