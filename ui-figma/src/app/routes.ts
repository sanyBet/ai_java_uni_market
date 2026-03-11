import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { CartPage } from "./pages/CartPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AddressManagePage } from "./pages/AddressManagePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfileInfoPage } from "./pages/ProfileInfoPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SupportPage, SettingsPage } from "./pages/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "category", Component: CategoryPage },
      { path: "cart", Component: CartPage },
      { path: "profile", Component: ProfilePage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "orders", Component: OrdersPage },
      { path: "address", Component: AddressManagePage },
      { path: "login", Component: LoginPage },
      { path: "profile-info", Component: ProfileInfoPage },
      { path: "order-success", Component: OrderSuccessPage },
      { path: "support", Component: SupportPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);