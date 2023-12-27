import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import ReceiveCash from "./ReceiveCash";
import Page from "src/app/custom-components/Page";
import { authRoles } from "src/app/auth";
i18next.addResourceBundle("en", "receiveCash", en);
i18next.addResourceBundle("ar", "receiveCash", ar);
i18next.addResourceBundle("fa", "receiveCash", fa);

const ReceiveCashConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "credit-debit/credit-cashdesk",
      element: (
        <Page title={"صندوق مانده دریافت ها"}>
          <ReceiveCash />
        </Page>
      ),
    },
  ],
};

export default ReceiveCashConfig;
