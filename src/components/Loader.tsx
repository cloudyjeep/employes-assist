import { Suspense, lazy, ComponentType, useMemo, ReactElement } from "react";

export const Loader = <T extends object>({
  component,
  fallback,
  ...props
}: {
  component: () => Promise<{ default: ComponentType<T> }>;
  fallback?: ReactElement;
} & T) => {
  const LazyComponent = useMemo(() => lazy(component), [component]);

  return (
    <Suspense fallback={fallback ?? <div />}>
      <LazyComponent {...(props as T)} />
    </Suspense>
  );
};

export const loader = <T extends object>(
  component: () => Promise<{ default: ComponentType<T> }>,
  props?: {
    fallback?: ReactElement;
  } & T
) => {
  const LazyComponent = useMemo(() => lazy(component), []);

  return (
    <Suspense fallback={props?.fallback ?? <div />}>
      <LazyComponent {...(props as T)} fallback={undefined} />
    </Suspense>
  );
};
