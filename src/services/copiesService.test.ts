import { describe, it, expect, vi, beforeEach } from "vitest";
import { copiesService } from "./copiesService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("CopiesService", () => {
  const mockWorkspaceId = "test-ws-id";
  const mockUserId = "test-user-id";

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: [], error: null });
  });

  describe("create", () => {
    it("deve criar uma copy com sucesso", async () => {
      const mockData = {
        id: "test-copy-id",
        created_at: new Date().toISOString(),
        user_id: mockUserId,
        workspace_id: mockWorkspaceId,
        title: "Test Title",
        content: "Test Content",
        platform: "email",
        copy_type: "ad",
      };

      const mockInsertReturn = {
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      };

      const mockFromReturn = {
        insert: vi.fn().mockReturnValue(mockInsertReturn),
      };

      (supabase.from as vi.Mock).mockReturnValue(mockFromReturn);

      const result = await copiesService.create(mockUserId, mockWorkspaceId, {
        title: "Test Title",
        content: "Test Content",
        platform: "email",
        copy_type: "ad",
      });

      expect(supabase.from).toHaveBeenCalledWith("copies");
      expect(mockFromReturn.insert).toHaveBeenCalledWith({
        user_id: mockUserId,
        workspace_id: mockWorkspaceId,
        title: "Test Title",
        content: "Test Content",
        platform: "email",
        copy_type: "ad",
      });
      expect(result).toEqual(mockData);
    });

    it("deve throw error se inserção falhar", async () => {
      const mockError = { message: "Insert failed" };

      const mockInsertReturn = {
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      };

      const mockFromReturn = {
        insert: vi.fn().mockReturnValue(mockInsertReturn),
      };

      (supabase.from as vi.Mock).mockReturnValue(mockFromReturn);

      await expect(
        copiesService.create(mockUserId, mockWorkspaceId, { content: "Test" })
      ).rejects.toThrow("Insert failed");
    });
  });

  describe("list", () => {
    it("deve listar copies com FTS RPC quando q presente", async () => {
      const mockData = [
        {
          id: "copy1",
          created_at: new Date().toISOString(),
          user_id: mockUserId,
          workspace_id: mockWorkspaceId,
          title: "Test Copy",
          content: "Test content match",
          total_count: 1,
        },
      ];

      (supabase.rpc as vi.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await copiesService.list({
        workspace_id: mockWorkspaceId,
        q: "test",
        page: 1,
        pageSize: 10,
      });

      expect(supabase.rpc).toHaveBeenCalledWith("search_copies_fts", {
        p_query: "test",
        p_workspace_id: mockWorkspaceId,
        p_page: 1,
        p_page_size: 10,
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("deve usar fallback ILIKE se RPC falhar", async () => {
      (supabase.rpc as vi.Mock).mockRejectedValue(new Error("RPC failed"));

      const mockData = [
        { id: "copy1", title: "Fallback test", workspace_id: mockWorkspaceId },
      ];
      const mockCount = 1;

      const mockRangeReturn = {
        data: mockData,
        count: mockCount,
        error: null,
      };

      const mockOrderReturn = {
        range: vi.fn().mockReturnValue(mockRangeReturn),
      };

      const mockOrReturn = {
        order: vi.fn().mockReturnValue(mockOrderReturn),
      };

      const mockEqReturn = {
        or: vi.fn().mockReturnValue(mockOrReturn),
      };

      const mockSelectReturn = {
        eq: vi.fn().mockReturnValue(mockEqReturn),
      };

      const mockFromReturn = {
        select: vi.fn().mockReturnValue(mockSelectReturn),
      };

      (supabase.from as vi.Mock).mockReturnValue(mockFromReturn);

      const result = await copiesService.list({
        workspace_id: mockWorkspaceId,
        q: "test",
        page: 1,
        pageSize: 10,
      });

      expect(supabase.rpc).toHaveBeenCalledWith("search_copies_fts", {
        p_query: "test",
        p_workspace_id: mockWorkspaceId,
        p_page: 1,
        p_page_size: 10,
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("deve listar sem busca (sem q)", async () => {
      const mockData = [
        { id: "copy1", title: "No search", workspace_id: mockWorkspaceId },
      ];
      const mockCount = 1;

      const mockRangeReturn = {
        data: mockData,
        count: mockCount,
        error: null,
      };

      const mockOrderReturn = {
        range: vi.fn().mockReturnValue(mockRangeReturn),
      };

      const mockEqReturn = {
        order: vi.fn().mockReturnValue(mockOrderReturn),
      };

      const mockSelectReturn = {
        eq: vi.fn().mockReturnValue(mockEqReturn),
      };

      const mockFromReturn = {
        select: vi.fn().mockReturnValue(mockSelectReturn),
      };

      (supabase.from as vi.Mock).mockReturnValue(mockFromReturn);

      const result = await copiesService.list({
        workspace_id: mockWorkspaceId,
        page: 1,
        pageSize: 10,
      });

      expect(supabase.rpc).not.toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("deve retornar vazio se tabela não existir", async () => {
      const mockRangeReturn = {
        data: null,
        error: { code: "PGRST116" },
        count: null,
      };

      const mockOrderReturn = {
        range: vi.fn().mockReturnValue(mockRangeReturn),
      };

      const mockEqReturn = {
        order: vi.fn().mockReturnValue(mockOrderReturn),
      };

      const mockSelectReturn = {
        eq: vi.fn().mockReturnValue(mockEqReturn),
      };

      const mockFromReturn = {
        select: vi.fn().mockReturnValue(mockSelectReturn),
      };

      (supabase.from as vi.Mock).mockReturnValue(mockFromReturn);

      const result = await copiesService.list({
        workspace_id: mockWorkspaceId,
      });

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
