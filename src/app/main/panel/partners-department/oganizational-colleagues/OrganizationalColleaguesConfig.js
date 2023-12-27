import OrganizationalColleagues from "./OrganizationalColleagues";
import i18next from "i18next";

import en from "./i18n/en";
import tr from "./i18n/tr";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import Page from "../../../../custom-components/Page.js";

i18next.addResourceBundle("en", "organizationalColleagues", en);
i18next.addResourceBundle("tr", "organizationalColleagues", tr);
i18next.addResourceBundle("ar", "organizationalColleagues", ar);
i18next.addResourceBundle("fa", "organizationalColleagues", fa);

const OrganizationalColleaguesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "associates-department/organizational-colleagues",
      element: (
        <Page title={" همکاران سازمانی"}>
          <OrganizationalColleagues/>
        </Page>
      ),
    },
    {
      path: "associates-department/organizational-colleagues/bill/:id",
      element: (
        <Page title={""}>
          <OrganizationalColleagues/>
        </Page>
      ),
    },
    {
      path: "associates-department/organizational-colleagues/accounting-book/:id",
      element: (
        <Page title={""}>
          <OrganizationalColleagues/>
        </Page>
      ),
    },
  ],
};

export default OrganizationalColleaguesConfig;
