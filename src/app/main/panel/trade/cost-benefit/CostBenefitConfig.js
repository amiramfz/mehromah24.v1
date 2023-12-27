import CostBenefit from "./CostBenefit";
import i18next from "i18next";

import en from "./i18n/en";
import tr from "./i18n/tr";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import Page from "../../../../custom-components/Page.js";

i18next.addResourceBundle("en", "costBenefit", en);
i18next.addResourceBundle("tr", "costBenefit", tr);
i18next.addResourceBundle("ar", "costBenefit", ar);
i18next.addResourceBundle("fa", "costBenefit", fa);

const CostBenefitConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "trade/cost-benefit",
      element: (
        <Page title={"سود و زیان"}>
          <CostBenefit />
        </Page>
      ),
    },
  ],
};

export default CostBenefitConfig;
