// Type declarations for static image asset imports (resolved by Metro at runtime).
// Without these, `import img from "./foo.png"` reports TS2307 "Cannot find module".
declare module "*.png" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpg" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpeg" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.gif" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.webp" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}
