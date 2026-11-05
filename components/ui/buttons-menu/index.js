import Link from "next/link";
import { usePathname } from "next/navigation";

import ButtonPanel from "components/ui/button-panel";
import Button from "components/ui/button";

import { useMenu } from "hooks/menu-context";

import {
  HomeIcon,
  PackagePlusIcon,
  ComponentIcon,
  PackageOpenIcon,
  PaintBucketIcon,
  SprayCanIcon,
  PaintRollerIcon,
  QrCodeIcon,
  TruckIcon,
  GlobeIcon,
  ReceiptIcon,
  MoveRightIcon,
  ChevronRightIcon,
} from "lucide-react";

const Icons = {
  HomeIcon,
  PackagePlusIcon,
  ComponentIcon,
  PackageOpenIcon,
  PaintBucketIcon,
  SprayCanIcon,
  PaintRollerIcon,
  QrCodeIcon,
  TruckIcon,
  GlobeIcon,
  ReceiptIcon,
  MoveRightIcon,
  ChevronRightIcon,
};

function getButtonState(item, props) {
  const isActive = item?.key === props.currentButton && props.loading;
  return {
    isActive,
    disabledClass: isActive
      ? "opacity-50 pointer-events-none cursor-not-allowed"
      : "",
  };
}

function getNavItemClassName(item, currentRoute) {
  const minW = Math.min(Math.ceil((item?.name?.length ?? 0) * 1.25), 20);
  const maxW = Math.min(Math.ceil((item?.name?.length ?? 0) * 1.5), 34);

  const activeOrHover =
    currentRoute === item?.href
      ? "pointer-events-none opacity-40 cursor-not-allowed lg:border-zinc-500 font-extrabold lg:border-b-4 lg:inline-block"
      : "hover:text-zinc-500 cursor-pointer hover:bg-transparent hover:shadow-none";

  return `
    ${activeOrHover}
    w-full lg:w-fit flex flex-row items-center justify-between lg:justify-center px-4 lg:px-0 pt-3
    lg:pt-5 pb-4 lg:min-w-[${minW}ch] lg:max-w-[${maxW}ch] shrink-0
    text-center text-lg lg:text-md bg-transparent text-stone-900 m-0
    lg:inline-block lg:border-b-4 lg:border-transparent transition-all duration-300
    hover:scale-120 hover:font-extrabold hover:border-zinc-500
  `;
}

function LoadingSpinner({ className = "w-6 h-6" }) {
  return (
    <div className="flex flex-row w-full h-16 justify-center items-center gap-2">
      <span
        className={`${className} border-2 border-stone-100 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

function MenuIcon({ name, className = "size-8" }) {
  const Icon = Icons[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

function NavItemLabel({ item }) {
  return (
    <>
      <span className="flex flex-row gap-2 items-center justify-center">
        <span className="lg:hidden">
          <MenuIcon name={item?.icon} className="w-auto" />
        </span>
        <span className="uppercase text-center">{item?.name}</span>
      </span>
      <span className="lg:hidden">
        <MenuIcon name="ChevronRightIcon" className="size-6 text-blue-950/50" />
      </span>
    </>
  );
}

function IconTransition({ from, to }) {
  return (
    <div className="flex flex-row justify-center items-center w-full px-2">
      <div className="flex flex-col items-center min-w-24 max-w-24">
        <span className="flex flex-col justify-center items-center">
          <MenuIcon name={from?.icon} />
        </span>
        <span className="text-sm">{from?.name}</span>
      </div>
      <div className="flex flex-col items-center min-w-24 max-w-24">
        <span className="flex flex-col justify-center items-center">
          <MenuIcon name="MoveRightIcon" />
        </span>
      </div>
      <div className="flex flex-col items-center min-w-24 max-w-24">
        <span className="flex flex-col justify-center items-center">
          <MenuIcon name={to?.icon} />
        </span>
        <span className="text-sm">{to?.name}</span>
      </div>
    </div>
  );
}

export default function ButtonsMenu({ item, renderType }) {
  const currentRoute = usePathname();
  const fnMenu = useMenu();

  function handleButton(e, key) {
    fnMenu.setLoading(true);

    const action = {
      spool: () => {
        e.preventDefault();
        setTimeout(() => {
          fnMenu.setOpenModalMenuTypes(false);
          fnMenu.setOpenModalMenuProcesses(true);
        }, 60);
      },
      transfer: () => {
        e.preventDefault();
        setTimeout(() => {
          fnMenu.setOpenModalMenuTypes(true);
        }, 60);
      },
      default: () => {
        fnMenu.setOpenModalMenuTypes(false);
        fnMenu.setOpenModalMenuProcesses(false);
      },
    };

    const ex = action[key] ?? action["default"];
    fnMenu.setCurrentButton(key);
    ex();

    fnMenu.setLoading(false);
  }

  const props = { ...fnMenu, currentRoute, handleButton };

  const elementType = {
    button: <ButtonMenuCustom item={item} props={props} />,
    header: <ButtonMenuHeader item={item} props={props} />,
    panel: <ButtonMenuPanel item={item} props={props} />,
    link: <LinkCustom item={item} props={props} />,
  };

  return elementType[renderType ?? "link"];
}

function ButtonMenuCustom({ item, props }) {
  const { isActive, disabledClass } = getButtonState(item, props);

  return (
    <Button
      key={item?.key}
      title={item?.text}
      disabled={isActive}
      onClick={(e) => props.handleButton(e, item?.key)}
      className={`
        flex flex-col w-full h-28 py-4 rounded-sm text-lg text-center
        gap-2 justify-center items-center text-blue-950 font-semibold uppercase
        border-blue-950/50 border-2 bg-stone-100-700
        hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600/50 hover:shadow-md
        transition mt-0
        ${disabledClass}`}
    >
      {isActive ? (
        <LoadingSpinner />
      ) : (
        <span className="flex flex-col justify-center items-center">
          <span className="text-sm">
            <MenuIcon name={item?.icon} />
          </span>
        </span>
      )}
      {item?.name}
      <p className="text-xs sm:text-sm normal-case font-normal">{item?.text}</p>
    </Button>
  );
}

function ButtonMenuPanel({ item, props }) {
  const { isActive, disabledClass } = getButtonState(item, props);

  return (
    <ButtonPanel
      key={item?.key}
      href={item?.href}
      text={item?.text}
      title={item?.text}
      target={item?.target}
      disabled={isActive}
      onClick={(e) => props.handleButton(e, item?.key)}
      className={disabledClass}
    >
      {isActive ? (
        <LoadingSpinner />
      ) : !item?.next ? (
        <span>
          <span className="flex flex-col justify-center items-center">
            <span className="text-sm">
              <MenuIcon name={item?.icon} />
            </span>
          </span>
          {item?.name}
        </span>
      ) : (
        <IconTransition from={item} to={item?.next} />
      )}
    </ButtonPanel>
  );
}

function ButtonMenuHeader({ item, props }) {
  return (
    <Button
      onClick={(e) => props.handleButton(e, item?.key)}
      className={getNavItemClassName(item, props.currentRoute)}
    >
      <NavItemLabel item={item} />
    </Button>
  );
}

function LinkCustom({ item, props }) {
  return (
    <Link
      href={item?.href}
      target={item?.target}
      className={`${getNavItemClassName(item, props.currentRoute)} truncate`}
    >
      <NavItemLabel item={item} />
    </Link>
  );
}
