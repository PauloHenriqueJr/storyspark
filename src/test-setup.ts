import { vi } from "vitest";
import { supabase } from "@/lib/supabase";

// Mock global para Supabase em testes
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: null, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

// Mock para React Router em testes
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: () => ({ pathname: "/" }),
    BrowserRouter: (props: any) => <div {...props} />,
    Routes: (props: any) => <div {...props} />,
    Route: (props: any) => <div {...props} />,
    MemoryRouter: (props: any) => <div {...props} />,
  };
});

// Mock para Lucide icons se necessário
vi.mock("lucide-react", () => ({
  // Mock todos os icons como um componente simples
  ...(Object as any).fromEntries(
    [
      "Home",
      "Bot",
      "Mic",
      "Upload",
      "History" /* adicione mais conforme necessário */,
    ].map((name) => [
      name,
      () => <div data-testid={`icon-${name.toLowerCase()}`} />,
    ])
  ),
}));
