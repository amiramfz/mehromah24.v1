import TemporarySubmit from "./TemporarySubmit";
import i18next from "i18next";

import en from "./i18n/en";
import tr from "./i18n/tr";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import Page from "../../../../custom-components/Page.js";

i18next.addResourceBundle("en", "temporarySubmit", en);
i18next.addResourceBundle("tr", "temporarySubmit", tr);
i18next.addResourceBundle("ar", "temporarySubmit", ar);
i18next.addResourceBundle("fa", "temporarySubmit", fa);

const TemporarySubmitConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "trade/temporarysubmit",
      element: (
        <Page title={"ثبت شناور"}>
          <TemporarySubmit />{" "}
        </Page>
      ),
    },
  ],
};

export default TemporarySubmitConfig;
