// Purpose: Define the type of .vue files for TypeScript to recognize them as Vue components.
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
