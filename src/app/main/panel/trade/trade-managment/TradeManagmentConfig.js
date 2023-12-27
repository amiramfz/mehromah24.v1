import TradeManagment from "./TradeManagment";
import OprationManagment from "./OprationManagment";
import i18next from "i18next";

import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";

i18next.addResourceBundle("en", "tradeManagment", en);
i18next.addResourceBundle("ar", "tradeManagment", ar);
i18next.addResourceBundle("fa", "tradeManagment", fa);
import Page from "../../../../custom-components/Page.js";

const TradeManagmentConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "trade/list",
      element: (
        <Page title={"مدیریت فروش"}>
          <TradeManagment />
        </Page>
      ),
    },
    {
      path: "trade/opration/:id",
      element: (
        <Page title={"رفرنس"}>
          <OprationManagment />
        </Page>
      ),
    },
  ],
};

export default TradeManagmentConfig;
