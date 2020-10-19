import React, { useCallback } from "react";
import classNames from "clsx";
import { Modifier } from "@popperjs/core";
import Popper, { PopperRenderProps } from "lib/ui/Popper";
import DropdownWrapper from "app/atoms/DropdownWrapper";
import { ReactComponent as ChevronDownIcon } from "app/icons/chevron-down.svg";

export type IconifiedSelectOptionRenderProps<T> = {
  option: T;
  index?: number;
};

type IconifiedSelectRenderComponent<T> = React.ComponentType<
  IconifiedSelectOptionRenderProps<T>
>;

type IconifiedSelectProps<T> = {
  iconContainerClassName?: string;
  Icon: IconifiedSelectRenderComponent<T>;
  OptionInMenuContent: IconifiedSelectRenderComponent<T>;
  OptionSelectedContent: IconifiedSelectRenderComponent<T>;
  getKey: (option: T) => string | number | undefined;
  options: T[];
  value: T;
  onChange?: (a: T) => void;
  className?: string;
  title: React.ReactNode;
};

const IconifiedSelect = <T extends unknown>({
  Icon,
  OptionInMenuContent,
  OptionSelectedContent,
  getKey,
  options,
  value,
  onChange,
  className,
  title,
  iconContainerClassName,
}: IconifiedSelectProps<T>) => {
  return (
    <div className={className}>
      {options.length > 1 ? (
        <>
          {title}

          <Popper
            placement="bottom"
            strategy="fixed"
            modifiers={[sameWidth]}
            popup={({ opened, setOpened, toggleOpened }) => (
              <IconifiedSelectMenu
                iconContainerClassName={iconContainerClassName}
                opened={opened}
                setOpened={setOpened}
                toggleOpened={toggleOpened}
                onChange={onChange}
                Icon={Icon}
                OptionInMenuContent={OptionInMenuContent}
                getKey={getKey}
                options={options}
                value={value}
              />
            )}
          >
            {({ ref, toggleOpened }) => (
              <SelectButton
                iconContainerClassName={iconContainerClassName}
                ref={ref}
                Content={OptionSelectedContent}
                Icon={Icon}
                value={value}
                dropdown
                onClick={toggleOpened}
              />
            )}
          </Popper>
        </>
      ) : (
        <SelectButton
          Icon={Icon}
          iconContainerClassName={iconContainerClassName}
          Content={OptionSelectedContent}
          value={value}
        />
      )}
    </div>
  );
};

export default IconifiedSelect;

type IconifiedSelectMenuProps<T> = PopperRenderProps &
  Omit<
    IconifiedSelectProps<T>,
    "className" | "title" | "OptionSelectedContent"
  >;

const IconifiedSelectMenu = <T extends unknown>(
  props: IconifiedSelectMenuProps<T>
) => {
  const {
    iconContainerClassName,
    opened,
    setOpened,
    onChange,
    options,
    value,
    getKey,
    Icon,
    OptionInMenuContent,
  } = props;
  const handleOptionClick = useCallback(
    (newValue: T) => {
      if (getKey(newValue) !== getKey(value)) {
        onChange?.(newValue);
      }
      setOpened(false);
    },
    [onChange, setOpened, value, getKey]
  );

  return (
    <DropdownWrapper
      opened={opened}
      className="origin-top-right"
      style={{ background: "white", border: "none" }}
    >
      {options.map((option) => (
        <IconifiedSelectOption
          iconContainerClassName={iconContainerClassName}
          key={getKey(option)}
          value={option}
          selected={getKey(option) === getKey(value)}
          onClick={handleOptionClick}
          Icon={Icon}
          OptionInMenuContent={OptionInMenuContent}
        />
      ))}
    </DropdownWrapper>
  );
};

type IconifiedSelectOptionProps<T> = Pick<
  IconifiedSelectProps<T>,
  "Icon" | "OptionInMenuContent" | "value" | "iconContainerClassName"
> & {
  value: T;
  selected: boolean;
  onClick?: IconifiedSelectProps<T>["onChange"];
};

const IconifiedSelectOption = <T extends unknown>(
  props: IconifiedSelectOptionProps<T>
) => {
  const {
    iconContainerClassName,
    value,
    selected,
    onClick,
    Icon,
    OptionInMenuContent,
  } = props;

  const handleClick = useCallback(() => {
    onClick?.(value);
  }, [onClick, value]);

  return (
    <button
      type="button"
      className={classNames(
        "w-full",
        "mb-1",
        "rounded",
        "transition easy-in-out duration-200",
        selected ? "bg-gray-200" : "hover:bg-gray-100",
        "cursor-pointer",
        "flex items-center"
      )}
      style={{
        padding: "0.375rem 1.5rem 0.375rem 0.5rem",
      }}
      autoFocus={selected}
      onClick={handleClick}
    >
      <div className={classNames("mr-3", iconContainerClassName)}>
        <Icon option={value} />
      </div>

      <OptionInMenuContent option={value} />
    </button>
  );
};

type SelectButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  Pick<
    IconifiedSelectProps<any>,
    "Icon" | "value" | "iconContainerClassName"
  > & {
    Content: IconifiedSelectProps<any>["OptionSelectedContent"];
    dropdown?: boolean;
  };

const SelectButton = React.forwardRef<HTMLButtonElement, SelectButtonProps>(
  (
    {
      Content,
      Icon,
      value,
      dropdown,
      iconContainerClassName,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={classNames(
          "w-full p-2",
          "border rounded-md",
          "flex items-center",
          dropdown ? "cursor-pointer" : "cursor-default",
          className
        )}
        {...rest}
      >
        <div className={classNames("mr-3", iconContainerClassName)}>
          <Icon option={value} />
        </div>

        <div className="font-light leading-none">
          <div className="flex items-center">
            <Content option={value} />
          </div>
        </div>

        {dropdown && (
          <>
            <div className="flex-1" />

            <ChevronDownIcon
              className={classNames(
                "mx-2 h-5 w-auto",
                "text-gray-600",
                "stroke-current stroke-2"
              )}
            />
          </>
        )}
      </button>
    );
  }
);

const sameWidth: Modifier<string, any> = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${
      (state.elements.reference as any).offsetWidth
    }px`;
    return () => {};
  },
};
