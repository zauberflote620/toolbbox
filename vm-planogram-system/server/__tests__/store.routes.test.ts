import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import storeRoutes from '../routes/store.routes.js';

// Mock Prisma
const mockPrisma = {
  store: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// Mock the middleware that adds prisma to req
const app = express();
app.use(express.json());
app.use((req: any, res, next) => {
  req.prisma = mockPrisma;
  next();
});
app.use('/api/stores', storeRoutes);

describe('Store Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/stores', () => {
    it('returns all stores', async () => {
      const mockStores = [
        {
          id: '1',
          name: 'Test Store 1',
          location: 'Location 1',
          dimensions: { width: 50, height: 30 },
          constraints: {},
          trafficPatterns: [],
        },
        {
          id: '2',
          name: 'Test Store 2',
          location: 'Location 2',
          dimensions: { width: 60, height: 40 },
          constraints: {},
          trafficPatterns: [],
        },
      ];

      mockPrisma.store.findMany.mockResolvedValue(mockStores);

      const response = await request(app).get('/api/stores');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStores);
      expect(mockPrisma.store.findMany).toHaveBeenCalled();
    });

    it('handles database errors', async () => {
      mockPrisma.store.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/stores');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/stores/:id', () => {
    it('returns store by id', async () => {
      const mockStore = {
        id: '1',
        name: 'Test Store',
        location: 'Test Location',
        dimensions: { width: 50, height: 30 },
        constraints: {},
        trafficPatterns: [],
      };

      mockPrisma.store.findUnique.mockResolvedValue(mockStore);

      const response = await request(app).get('/api/stores/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStore);
      expect(mockPrisma.store.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('returns 404 for non-existent store', async () => {
      mockPrisma.store.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/stores/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Store not found');
    });
  });

  describe('POST /api/stores', () => {
    it('creates a new store', async () => {
      const newStore = {
        name: 'New Store',
        location: 'New Location',
        dimensions: { width: 50, height: 30 },
        constraints: {},
        trafficPatterns: [],
      };

      const createdStore = { id: '1', ...newStore };
      mockPrisma.store.create.mockResolvedValue(createdStore);

      const response = await request(app)
        .post('/api/stores')
        .send(newStore);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdStore);
      expect(mockPrisma.store.create).toHaveBeenCalledWith({
        data: newStore,
      });
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/stores')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('validates dimensions format', async () => {
      const response = await request(app)
        .post('/api/stores')
        .send({
          name: 'Test Store',
          location: 'Test Location',
          dimensions: 'invalid',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/stores/:id', () => {
    it('updates an existing store', async () => {
      const updateData = {
        name: 'Updated Store',
        location: 'Updated Location',
      };

      const updatedStore = {
        id: '1',
        name: 'Updated Store',
        location: 'Updated Location',
        dimensions: { width: 50, height: 30 },
        constraints: {},
        trafficPatterns: [],
      };

      mockPrisma.store.update.mockResolvedValue(updatedStore);

      const response = await request(app)
        .put('/api/stores/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedStore);
      expect(mockPrisma.store.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('returns 404 for non-existent store', async () => {
      mockPrisma.store.update.mockRejectedValue({ code: 'P2025' });

      const response = await request(app)
        .put('/api/stores/nonexistent')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Store not found');
    });
  });

  describe('DELETE /api/stores/:id', () => {
    it('deletes a store', async () => {
      mockPrisma.store.delete.mockResolvedValue({ id: '1' });

      const response = await request(app).delete('/api/stores/1');

      expect(response.status).toBe(204);
      expect(mockPrisma.store.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('returns 404 for non-existent store', async () => {
      mockPrisma.store.delete.mockRejectedValue({ code: 'P2025' });

      const response = await request(app).delete('/api/stores/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Store not found');
    });
  });
});