import * as React from "react";
import { type VariantProps } from "class-variance-authority";

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;

export { type ToastProps as ToasterProps };