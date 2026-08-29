import { createBrowserRouter } from "react-router-dom";
import App from "@/app/App.tsx";
import { DashboardPage } from "@/pages/DashboardPage.tsx";
import { CoinDetailsPage } from "@/pages/CoinDetailsPage.tsx";
import { PortfolioPage } from "@/pages/PortfolioPage.tsx";
import { WatchlistPage } from "@/pages/WatchlistPage.tsx";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DashboardPage />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        // path: "coin-details",
        path: "/coins/:id",
        element: <CoinDetailsPage />
      },
      {
        path: "portfolio",
        element: <PortfolioPage />
      },
      {
        path: "watchlist",
        element: <WatchlistPage />
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  },
])