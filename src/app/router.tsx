import { createBrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoinDetailsPage } from "@/pages/CoinDetailsPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "coins/:id",
        element: <CoinDetailsPage />
      },
      {
        path: "portfolio",
        element: <PortfolioPage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      },
    ]
  },
],
  { basename: import.meta.env.BASE_URL }
)