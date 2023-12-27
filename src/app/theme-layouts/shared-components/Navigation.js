import FuseNavigation from "@fuse/core/FuseNavigation";
import clsx from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNavigation } from "app/store/fuse/navigationSlice";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { navbarCloseMobile } from "app/store/fuse/navbarSlice";
//start added import
import { selectUser } from "app/store/userSlice";
import { getAccessUser } from "src/app/main/panel/trade/trade-managment/files/oprations/functions";

function Navigation(props) {
  const [navigation, setNavigation] = useState(useSelector(selectNavigation));
  //start added code
  const user = useSelector(selectUser);
  function authRoleNavigation() {
    // sell managment component
    if (!getAccessUser("trade", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "sell-managment-component"
        );
      });
    }

    if (!getAccessUser("trade", "flights", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "sell-managment-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "buy-flight"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("trade", "custom", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "sell-managment-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "temporary-registration"
            );
          }
        });
        return updatedNavigation;
      });
    }

    if (!getAccessUser("trade", "list", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "sell-managment-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "trade-managment"
            );
          }
        });
        return updatedNavigation;
      });
    }

    // receives pays component
    if (!getAccessUser("credit_debit", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "receives-pays-component"
        );
      });
    }

    if (!getAccessUser("credit_debit", "credit", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "receives-pays-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "receives-cash"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("credit_debit", "debit", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "receives-pays-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "payss-cash"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("credit_debit", "current", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "receives-pays-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "Current-payments"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("credit_debit", "list", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "receives-pays-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "Management_of-receipts"
            );
          }
        });
        return updatedNavigation;
      });
    }

    // salary
    if (!getAccessUser("salary", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        console.log(prevNavigation);
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter((item) => item.id !== "salary");
      });
    }

    // Basic-definitions
    if (!getAccessUser("accounting", "settings", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "Basic-definitions"
        );
      });
    }

    // customers department component
    if (!getAccessUser("customers", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "customers-department-component"
        );
      });
    }

    if (!getAccessUser("customers", "list", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "customers-department-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "customers"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("customers", "callcenter", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "customers-department-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "call-control-center"
            );
          }
        });
        return updatedNavigation;
      });
    }
    if (!getAccessUser("customers", "communication", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "customers-department-component") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "communication-services"
            );
          }
        });
        return updatedNavigation;
      });
    }

    // Organizational department
    if (!getAccessUser("organizational", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "Organizational-department"
        );
      });
    }

    // // administrative-department
    if (!getAccessUser("official", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "administrative-department"
        );
      });
    }

    // // Associates-Department
    if (!getAccessUser("colleagues", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "Associates-Department"
        );
      });
    }

    if (!getAccessUser("colleagues", "list", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "Associates-Department") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "Organizational-colleagues"
            );
          }
        });
        return updatedNavigation;
      });
    }

    if (!getAccessUser("colleagues", "announcement", user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        updatedNavigation.forEach((item) => {
          if (item.id === "Associates-Department") {
            item.children = item.children.filter(
              (childItem) => childItem.id !== "Announcements"
            );
          }
        });
        return updatedNavigation;
      });
    }

    // // Administrative-settings
    if (!getAccessUser("settings", false, user.data.access)) {
      setNavigation((prevNavigation) => {
        const updatedNavigation = [...prevNavigation];
        return updatedNavigation.filter(
          (item) => item.id !== "Administrative-settings"
        );
      });
    }

    // // Announcements
    // if (!getAccessUser('reports', 'calls' , user.data.access)) {
    //   setNavigation((prevNavigation) => {
    //     const updatedNavigation = [...prevNavigation];
    //     updatedNavigation.forEach((item) => {
    //       if (item.id === "reports") {
    //         item.children = item.children.filter((childItem) => childItem.id !== "Call-reports");
    //       }
    //     });
    //     return updatedNavigation;
    //   });
    // }
    // if (!getAccessUser('reports', 'salary' , user.data.access)) {
    //   setNavigation((prevNavigation) => {
    //     const updatedNavigation = [...prevNavigation];
    //     updatedNavigation.forEach((item) => {
    //       if (item.id === "reports") {
    //         item.children = item.children.filter((childItem) => childItem.id !== "Salary-reports");
    //       }
    //     });
    //     return updatedNavigation;
    //   });
    // }
    // if (!getAccessUser('reports', 'trade' , user.data.access)) {
    //   setNavigation((prevNavigation) => {
    //     const updatedNavigation = [...prevNavigation];
    //     updatedNavigation.forEach((item) => {
    //       if (item.id === "reports") {
    //         item.children = item.children.filter((childItem) => childItem.id !== "Entry-and-exit-reports");
    //       }
    //     });
    //     return updatedNavigation;
    //   });
    // }
    // if (!getAccessUser('reports', 'calls' , user.data.access)) {
    //   setNavigation((prevNavigation) => {
    //     const updatedNavigation = [...prevNavigation];
    //     updatedNavigation.forEach((item) => {
    //       if (item.id === "reports") {
    //         item.children = item.children.filter((childItem) => childItem.id !== "Call-reports");
    //       }
    //     });
    //     return updatedNavigation;
    //   });
    // }
    // if (!getAccessUser('reports', 'calls' , user.data.access)) {
    //   setNavigation((prevNavigation) => {
    //     const updatedNavigation = [...prevNavigation];
    //     updatedNavigation.forEach((item) => {
    //       if (item.id === "reports") {
    //         item.children = item.children.filter((childItem) => childItem.id !== "Call-reports");
    //       }
    //     });
    //     return updatedNavigation;
    //   });
    // }
  }
  useEffect(() => {
    authRoleNavigation();
  }, []);
  //end added code

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const dispatch = useDispatch();

  return useMemo(() => {
    function handleItemClick(item) {
      if (isMobile) {
        dispatch(navbarCloseMobile());
      }
    }

    return (
      <FuseNavigation
        className={clsx("navigation", props.className)}
        navigation={navigation}
        layout={props.layout}
        dense={props.dense}
        active={props.active}
        onItemClick={handleItemClick}
      />
    );
  }, [
    dispatch,
    isMobile,
    navigation,
    props.active,
    props.className,
    props.dense,
    props.layout,
  ]);
}

Navigation.defaultProps = {
  layout: "vertical",
};

export default memo(Navigation);
