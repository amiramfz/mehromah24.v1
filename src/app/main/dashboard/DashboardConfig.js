import i18next from "i18next";

import en from "./i18n/en";
import tr from "./i18n/tr";
import ar from "./i18n/ar";
import Dashboard from "./Dashboard";
import Page from "src/app/custom-components/Page";

i18next.addResourceBundle("en", "dashboardPage", en);
i18next.addResourceBundle("tr", "dashboardPage", tr);
i18next.addResourceBundle("ar", "dashboardPage", ar);

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "dashboard",
      element: (
        <Page title="داشبورد">
          <Dashboard />
        </Page>
      ),
    },
  ],
};

export default DashboardConfig;

// // import AnalyticsDashboardAppConfig from './analytics/AnalyticsDashboardAppConfig';
// import ProjectDashboardAppConfig from "./project/ProjectDashboardAppConfig";
// // import FinanceDashboardAppConfig from './finance/FinanceDashboardAppConfig';
// // import CryptoDashboardAppConfig from './crypto/CryptoDashboardAppConfig';

// const dashboardsConfigs = [
//   // AnalyticsDashboardAppConfig,
//   ProjectDashboardAppConfig,
//   // FinanceDashboardAppConfig,
//   // CryptoDashboardAppConfig,
// ];

// export default dashboardsConfigs;
