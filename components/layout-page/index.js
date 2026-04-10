import { twMerge } from "tailwind-merge";

import Body from "components/body";
import Header from "components/header";

export default function LayoutPage({ title, subTitle, children, ...props }) {
  return (
    <div className={twMerge(`w-full h-full bg-stone-100`, props.className)}>
      <Header title={title} />
      <Body title={subTitle}>{children}</Body>
    </div>
  );
}
