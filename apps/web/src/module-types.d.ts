declare module './features/*' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
