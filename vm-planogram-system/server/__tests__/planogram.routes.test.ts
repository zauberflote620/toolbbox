import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import planogramRoutes from '../routes/planogram.routes.js';

// Mock Prisma
const mockPrisma = {
  planogram: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  store: {
    findUnique: vi.fn(),
  },
};

// Mock the middleware that adds prisma to req
const app = express();
app.use(express.json());
app.use((req: any, res, next) => {
  req.prisma = mockPrisma;
  next();
});
app.use('/api/planograms', planogramRoutes);

describe('Planogram Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/planograms', () => {
    it('returns all planograms', async () => {
      const mockPlanograms = [
        {
          id: '1',
          name: 'Test Planogram 1',
          storeId: 'store1',
          layoutData: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          store: { name: 'Test Store 1' },
        },
        {
          id: '2',
          name: 'Test Planogram 2',
          storeId: 'store2',
          layoutData: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          store: { name: 'Test Store 2' },
        },
      ];

      mockPrisma.planogram.findMany.mockResolvedValue(mockPlanograms);

      const response = await request(app).get('/api/planograms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlanograms);
      expect(mockPrisma.planogram.findMany).toHaveBeenCalledWith({
        include: { store: true },
      });
    });

    it('filters planograms by storeId', async () => {
      const mockPlanograms = [
        {
          id: '1',
          name: 'Test Planogram 1',
          storeId: 'store1',
          layoutData: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          store: { name: 'Test Store 1' },
        },
      ];

      mockPrisma.planogram.findMany.mockResolvedValue(mockPlanograms);

      const response = await request(app).get('/api/planograms?storeId=store1');

      expect(response.status).toBe(200);
      expect(mockPrisma.planogram.findMany).toHaveBeenCalledWith({
        where: { storeId: 'store1' },
        include: { store: true },
      });
    });
  });

  describe('GET /api/planograms/:id', () => {
    it('returns planogram by id', async () => {
      const mockPlanogram = {
        id: '1',
        name: 'Test Planogram',
        storeId: 'store1',
        layoutData: { fixtures: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
        store: { name: 'Test Store' },
      };

      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);

      const response = await request(app).get('/api/planograms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlanogram);
      expect(mockPrisma.planogram.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { store: true },
      });
    });

    it('returns 404 for non-existent planogram', async () => {
      mockPrisma.planogram.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/planograms/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Planogram not found');
    });
  });

  describe('POST /api/planograms', () => {
    it('creates a new planogram', async () => {
      const newPlanogram = {
        name: 'New Planogram',
        storeId: 'store1',
        layoutData: { fixtures: [] },
      };

      const createdPlanogram = {
        id: '1',
        ...newPlanogram,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.store.findUnique.mockResolvedValue({ id: 'store1' });
      mockPrisma.planogram.create.mockResolvedValue(createdPlanogram);

      const response = await request(app)
        .post('/api/planograms')
        .send(newPlanogram);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPlanogram);
      expect(mockPrisma.planogram.create).toHaveBeenCalledWith({
        data: newPlanogram,
        include: { store: true },
      });
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/planograms')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('validates store exists', async () => {
      mockPrisma.store.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/planograms')
        .send({
          name: 'Test Planogram',
          storeId: 'nonexistent',
          layoutData: {},
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Store not found');
    });
  });

  describe('PUT /api/planograms/:id', () => {
    it('updates an existing planogram', async () => {
      const updateData = {
        name: 'Updated Planogram',
        layoutData: { fixtures: [{ id: 'f1' }] },
      };

      const updatedPlanogram = {
        id: '1',
        name: 'Updated Planogram',
        storeId: 'store1',
        layoutData: { fixtures: [{ id: 'f1' }] },
        createdAt: new Date(),
        updatedAt: new Date(),
        store: { name: 'Test Store' },
      };

      mockPrisma.planogram.update.mockResolvedValue(updatedPlanogram);

      const response = await request(app)
        .put('/api/planograms/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPlanogram);
      expect(mockPrisma.planogram.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: { store: true },
      });
    });

    it('returns 404 for non-existent planogram', async () => {
      mockPrisma.planogram.update.mockRejectedValue({ code: 'P2025' });

      const response = await request(app)
        .put('/api/planograms/nonexistent')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Planogram not found');
    });
  });

  describe('DELETE /api/planograms/:id', () => {
    it('deletes a planogram', async () => {
      mockPrisma.planogram.delete.mockResolvedValue({ id: '1' });

      const response = await request(app).delete('/api/planograms/1');

      expect(response.status).toBe(204);
      expect(mockPrisma.planogram.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('returns 404 for non-existent planogram', async () => {
      mockPrisma.planogram.delete.mockRejectedValue({ code: 'P2025' });

      const response = await request(app).delete('/api/planograms/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Planogram not found');
    });
  });
});