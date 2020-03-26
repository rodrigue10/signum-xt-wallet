import * as React from "react";
import { ThanosClientProvider, useThanosClient } from "lib/thanos/front/client";
import { ReadyThanosProvider } from "lib/thanos/front/ready";

export * from "lib/thanos/types";
export * from "lib/thanos/front/client";
export * from "lib/thanos/front/ready";
export * from "lib/thanos/front/balance";

export const ThanosProvider: React.FC = ({ children }) => (
  <ThanosClientProvider>
    <ConditionalReadyThanos>{children}</ConditionalReadyThanos>
  </ThanosClientProvider>
);

const ConditionalReadyThanos: React.FC = ({ children }) => {
  const { ready } = useThanosClient();

  return React.useMemo(
    () =>
      ready ? (
        <ReadyThanosProvider>{children}</ReadyThanosProvider>
      ) : (
        <>{children}</>
      ),
    [children, ready]
  );
};