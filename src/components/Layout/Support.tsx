import { Suspense, lazy, ComponentType, useMemo, Fragment } from "react";
import { Route, RouteProps } from "react-router-dom";

type Props<T extends object = {}> = RouteProps & {
  component: () => Promise<{ default: ComponentType<T> }>;
  props?: T;
};

export const loader = <T extends object>({
  component,
  props,
  ...others
}: Props<T>) => {
  const LazyComponent = useMemo(() => lazy(component), [component]);

  return (
    <Route
      {...others}
      element={
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent {...(props ?? ({} as T))} />
          </Suspense>
        </div>
      }
    />
  );
};
