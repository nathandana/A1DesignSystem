import type { AnchorHTMLAttributes } from "react";
import { Button, Cluster, Link } from "../src/index.js";

function RouterLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}

export const buttonAnchor = <Button as="a" href="/account">Account</Button>;
export const buttonRouterLink = <Button as={RouterLink} href="/account">Account</Button>;
export const customLink = <Link as={RouterLink} href="/documentation">Documentation</Link>;
export const semanticCluster = <Cluster gap="lg" rowGap="xs" columnGap="md" />;
