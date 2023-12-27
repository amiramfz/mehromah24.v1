import WebView from "./WebView.js";
import i18next from "i18next";

import en from "./i18n/en";
import ar from "./i18n/ar";
import fa from "./i18n/fa";
import Page from "src/app/custom-components/Page.js";

i18next.addResourceBundle("en", "webView", en);
i18next.addResourceBundle("ar", "webView", ar);
i18next.addResourceBundle("fa", "webView", fa);

const WebViewConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [

    {
      path: "print/:type/:lang/:id",
      element: (
        <Page title={"مشاهده"}>
          <WebView />
        </Page>
      ),
    },
  ],
};

export default WebViewConfig;
