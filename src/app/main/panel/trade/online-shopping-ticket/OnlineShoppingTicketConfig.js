import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import OnlineShopping from "./OnlineShopping";
import OnlineSubmit from "./OnlineSubmit";
import Page from "src/app/custom-components/Page";

i18next.addResourceBundle("en", "onlineShopping", en);
i18next.addResourceBundle("ar", "onlineShopping", ar);
i18next.addResourceBundle("fa", "onlineShopping", fa);

const OnlineShoppingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "trade/online-ticket",
      element: (
        <Page title={"خرید آنلاین بلیط"}>
          <OnlineShopping />
        </Page>
      ),
    },
    {
      path: "trade/online-ticket/submit/:id",
      element: (
        <Page title={"ثبت پرواز"}>
          <OnlineSubmit />
        </Page>
      ),
    },
  ],
};

export default OnlineShoppingConfig;
