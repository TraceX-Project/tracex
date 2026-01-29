import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { type Modifier } from "@dnd-kit/core";

export const restrictRackToContainer: Modifier = (args) => {
  const { active } = args;
  const activeType = active?.data.current?.type as "rack" | "device";

  if (activeType === "rack") {
    return restrictToParentElement({
      ...args,
      transform: restrictToHorizontalAxis(args),
    });
  }

  return args.transform;
};
