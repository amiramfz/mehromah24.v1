import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import Page from "src/app/custom-components/Page";
import PaysReceivesManagement from "./PaysReceivesManagement";

i18next.addResourceBundle("en", "payCash", en);
i18next.addResourceBundle("ar", "payCash", ar);
i18next.addResourceBundle("fa", "payCash", fa);

const PaysReceivesManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "credit-debit/list",
      element: (
        <Page title={"مدیریت دریافت و پرداخت"}>
          <PaysReceivesManagement />
        </Page>
      ),
    },
  ],
};

export default PaysReceivesManagementConfig;
