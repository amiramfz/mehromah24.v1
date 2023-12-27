import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import DashboardConfig from "../main/dashboard/DashboardConfig";
import TemporarySubmitConfig from "../main/panel/trade/temporary-submit/TemporarySubmitConfig";
import TradeManagmentConfig from "../main/panel/trade/trade-managment/TradeManagmentConfig";
import CustomersDepartmentConfig from "../main/panel/customers/Customer-department/CustomersDepartmentConfig";
import dashboardsConfigs from "../main/dashboard/DashboardConfig";
import OnlineShoppingConfig from "../main/panel/trade/online-shopping-ticket/OnlineShoppingTicketConfig";
import PaysReceivesManagementConfig from "../main/panel/receivesandpays/pays-receives-managment/PaysReceivesManagementConfig";
import ReceiveCashConfig from "../main/panel/receivesandpays/receives-cash/ReceiveCashConfig";
import PayCashConfig from "../main/panel/receivesandpays/pays-cash/PayCashConfig";
import CostBenefitConfig from "../main/panel/trade/cost-benefit/CostBenefitConfig";
import WebViewConfig from "../main/panel/webview/WebViewConfig";
import OrganizationalColleaguesConfig from "../main/panel/partners-department/oganizational-colleagues/OrganizationalColleaguesConfig";

const routeConfigs = [
  // ...dashboardsConfigs,
  PayCashConfig,
  ReceiveCashConfig,
  PaysReceivesManagementConfig,
  OnlineShoppingConfig,
  TemporarySubmitConfig,
  TradeManagmentConfig,
  CustomersDepartmentConfig,
  DashboardConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  CostBenefitConfig,
  WebViewConfig,
  OrganizationalColleaguesConfig,

];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
