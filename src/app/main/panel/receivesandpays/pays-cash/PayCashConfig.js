import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import PayCash from "./PayCash";
import Page from "src/app/custom-components/Page";

i18next.addResourceBundle("en", "payCash", en);
i18next.addResourceBundle("ar", "payCash", ar);
i18next.addResourceBundle("fa", "payCash", fa);

const PayCashConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "credit-debit/debit-cashdesk",
      element: (
        <Page title={"صندوق مانده پرداخت ها"}>
          <PayCash />
        </Page>
      ),
    },
  ],
};

export default PayCashConfig;
