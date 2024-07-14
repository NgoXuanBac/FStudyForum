import React, { Suspense, ComponentType } from "react";

const Loadable =
  <P extends object>(Component: ComponentType<P>): React.FC<P> =>
  (props: P) =>
    (
      <Suspense>
        <Component {...props} />
      </Suspense>
    );

export default Loadable;
