import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import CustomersDepartment from "./CustomersDepartment";
import Page from "src/app/custom-components/Page";

i18next.addResourceBundle("en", "customersDepartment", en);
i18next.addResourceBundle("ar", "customersDepartment", ar);
i18next.addResourceBundle("fa", "customersDepartment", fa);

const CustomersDepartmentConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "customers-department/customers",
      element: (
        <Page title={"دپارتمان مشتری"}>
          <CustomersDepartment />
        </Page>
      ),
    },
  ],
};

export default CustomersDepartmentConfig;
