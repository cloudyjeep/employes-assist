import { Suspense } from "react";
import { BoxFlex } from "../Custom";
import { Header } from "./Header";

const MainLayout: FC<{}> = (props) => {
  return (
    <BoxFlex column width="100%" maxWidth={1366} px={2} gap={2} alignSelf="center" pb={10}>
      <Header />
      <Suspense fallback={<div />}>{props.children}</Suspense>
    </BoxFlex>
  );
};

export default MainLayout;
