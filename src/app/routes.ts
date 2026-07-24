import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./pages/Home";
import Mes from "./pages/Mes";
import Metas from "./pages/Metas";
import Graficos from "./pages/Graficos";
import Marcos from "./pages/Marcos";
import Expedicoes from "./pages/Expedicoes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "mes", Component: Mes },
      { path: "metas", Component: Metas },
      { path: "graficos", Component: Graficos },
      { path: "marcos", Component: Marcos },
      { path: "expedicoes", Component: Expedicoes },
    ],
  },
]);
