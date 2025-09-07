import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as supabaseMod from '@/lib/supabase';
import { copiesService } from '@/services/copiesService';

// Mock supabase client methods used in the service
const fromMock = vi.fn();
const insertMock = vi.fn();
const selectMock = vi.fn();
const singleMock = vi.fn();
const orderMock = vi.fn();
const eqMock = vi.fn();
const orMock = vi.fn();
const rangeMock = vi.fn();
const rpcMock = vi.fn();

vi.mock('@/lib/supabase', async () => {
  return {
    supabase: {
      from: (...args: any[]) => fromMock(...args),
      rpc: (...args: any[]) => rpcMock(...args),
    },
  };
});

describe('copiesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Chainable mocks for insert/select/single
    singleMock.mockResolvedValue({ data: { id: '1' }, error: null });
    selectMock.mockReturnValue({ single: () => singleMock() });
    insertMock.mockReturnValue({ select: () => ({ single: () => singleMock() }) });

    // Chainable mocks for list
    const listResult = { data: [], error: null, count: 0, status: 200 };
    rangeMock.mockResolvedValue(listResult);
    orMock.mockReturnValue({ range: (...a: any[]) => rangeMock(...a) });
    eqMock.mockReturnValue({ eq: eqMock, or: orMock, range: (...a: any[]) => rangeMock(...a), order: orderMock });
    orderMock.mockReturnValue({ eq: eqMock, or: orMock, range: (...a: any[]) => rangeMock(...a) });

    fromMock.mockImplementation((table: string) => {
      if (table === 'copies') {
        return {
          insert: (...a: any[]) => insertMock(...a),
          select: (..._cols: any[]) => ({ order: (...a: any[]) => orderMock(...a) }),
          order: (...a: any[]) => orderMock(...a),
          eq: (...a: any[]) => eqMock(...a),
          or: (...a: any[]) => orMock(...a),
          range: (...a: any[]) => rangeMock(...a),
        } as any;
      }
      throw new Error('Unexpected table: ' + table);
    });

    // RPC default to reject (simulate not created), so service falls back
    rpcMock.mockRejectedValue(new Error('function not found'));
  });

  it('create() insere e retorna o registro', async () => {
    const rec = await copiesService.create('user1', 'ws1', { content: 'hello' });
    expect(insertMock).toHaveBeenCalled();
    expect(rec).toBeTruthy();
  });

  it('list() usa fallback ILIKE quando RPC falha', async () => {
    const res = await copiesService.list({ q: 'test', page: 1, pageSize: 10 });
    expect(rpcMock).toHaveBeenCalled();
    expect(rangeMock).toHaveBeenCalled();
    expect(res.total).toBe(0);
  });
});
