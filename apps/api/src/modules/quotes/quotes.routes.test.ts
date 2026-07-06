import { test, mock } from 'node:test';
import assert from 'node:assert';
import { Pool } from 'pg';

let dbQueryResults: any = { rows: [] };
let lastQueryText = '';
let lastQueryParams: any[] = [];

mock.method(Pool.prototype, 'query', async (text: string, params?: any[]) => {
  lastQueryText = text;
  lastQueryParams = params || [];

  const lowerText = text.toLowerCase();

  if (lowerText.includes('select') && lowerText.includes('quotes')) {
    if (lowerText.includes('where q.id = $1')) {
      const mockQuote = dbQueryResults.quote;
      return { rows: mockQuote ? [mockQuote] : [] };
    }
    return { rows: dbQueryResults.quotes || [] };
  }

  return { rows: [] };
});

import express from 'express';
import { quotesRouter } from './quotes.routes';
import { generateAccessToken } from '../../services/jwt.service';

const token = generateAccessToken({
  userId: 'test-user-uuid',
  email: 'test@wrectifai.com',
  name: 'Test Tester',
  roles: ['customer'],
});

const app = express();
app.use(express.json());
app.use('/quotes', quotesRouter);

function request(method: string, path: string, body?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    const req: any = {
      method,
      url: path,
      headers: { 
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body,
    };

    const res: any = {
      statusCode: 200,
      headers: {},
      setHeader(name: string, value: string) {
        this.headers[name] = value;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve({ status: this.statusCode, body: data });
      },
      send(data: any) {
        resolve({ status: this.statusCode, body: data });
      },
      end() {
        resolve({ status: this.statusCode, body: null });
      },
    };

    (app as any).handle(req, res);
  });
}

test('quotes routes - GET /quotes returns mapped quotes', async () => {
  const mockQuotesList = [
    {
      id: 'mock-quote-uuid-1',
      quoteRequestId: 'qr-1',
      amount: 3050.00,
      currency: 'INR',
      etaDays: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      details: {
        ui_status: 'new',
        parts: 1650,
        labour: 1050,
        consumables: 200,
        gst: 150,
        availability: 'Today, 6:00 PM',
        pickup_drop: 'Available',
        warranty: '6 Months / 10,000 km',
        experience: '8+ Years',
        savings: 450,
      },
      garageName: 'QuickPit Service Center',
      ratingAvg: 4.6,
      ratingCount: 128,
      pickupDropSupported: true,
    },
  ];
  dbQueryResults = { quotes: mockQuotesList };

  const response = await request('GET', '/quotes');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.data.length, 1);
  assert.strictEqual(response.body.data[0].garage, 'QuickPit Service Center');
  assert.strictEqual(response.body.data[0].price, '$3,050');
  assert.strictEqual(response.body.data[0].savings, '$450');
});

test('quotes routes - GET /quotes/:id returns quote details', async () => {
  dbQueryResults = {
    quote: {
      id: 'mock-quote-uuid-1',
      quoteRequestId: 'qr-1',
      amount: 3050.00,
      currency: 'USD',
      etaDays: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      details: {
        ui_status: 'new',
        parts: 1650,
        labour: 1050,
        consumables: 200,
        gst: 150,
        availability: 'Today, 6:00 PM',
        pickup_drop: 'Available',
        warranty: '6 Months / 10,000 km',
        experience: '8+ Years',
        savings: 450,
      },
      garageName: 'QuickPit Service Center',
      ratingAvg: 4.6,
      ratingCount: 128,
      pickupDropSupported: true,
    },
  };

  const response = await request('GET', '/quotes/mock-quote-uuid-1');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.data.id, 'mock-quote-uuid-1');
  assert.strictEqual(response.body.data.details.parts, 1650);
});
