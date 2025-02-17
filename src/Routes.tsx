import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { actions, KeyStore, User, useStoreLoggedIn } from "./lib/store";
import { checkSession } from "./api/user";
import { parseJSON } from "./lib/utils";
import { useDispatch } from "react-redux";
import { decrypt } from "./lib/crypto";
import { Loader, loader } from "./components/Loader";
import { BoxFlex } from "./components/Custom";
import { CircularProgress } from "@mui/material";

// List of routes
const ListRoute = () => (
  <Routes>
    <Route path="*" element={loader(() => import("./pages/Employee/Data"))} />
    <Route path="/add" element={loader(() => import("./pages/Employee/Add"))} />
    <Route
      path="/edit/:id"
      element={loader(() => import("./pages/Employee/Edit"))}
    />
  </Routes>
);

export default function () {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const loggedIn = useStoreLoggedIn();

  // validation session from cache localStorage
  useEffect(() => {
    let destroy: boolean;

    setTimeout(async () => {
      if (loggedIn || destroy) return;

      const session = localStorage.getItem(KeyStore);
      const data = parseJSON<User>(decrypt(session as string));
      if (data) {
        try {
          console.log("load daa");
          const user = await checkSession(data.email, data.password);
          dispatch(actions.setSession(user));
        } catch (e) {}
      }
      setLoading(false);
    });

    return () => {
      destroy = true;
    };
  }, []);

  if (loading)
    return (
      <BoxFlex height="100vh" alignItems="center" sx={{ opacity: 0.5 }}>
        <CircularProgress size={12} color="inherit" />
      </BoxFlex>
    );

  return loggedIn ? (
    <Loader component={() => import("./components/Layout/MainLayout")}>
      <BrowserRouter>
        <ListRoute />
      </BrowserRouter>
    </Loader>
  ) : (
    <Loader component={() => import("./pages/Login")} />
  );
}
