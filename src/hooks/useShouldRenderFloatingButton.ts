import { useLocation } from "react-router-dom";

// Hook para verificar se deve renderizar o FloatingCopyButton
export const useShouldRenderFloatingButton = () => {
  const location = useLocation();

  // Não renderizar em páginas admin
  return !location.pathname.startsWith("/admin");
};
