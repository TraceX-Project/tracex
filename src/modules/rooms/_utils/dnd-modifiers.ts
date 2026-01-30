import { restrictToHorizontalAxis, restrictToParentElement, restrictToWindowEdges } from "@dnd-kit/modifiers";
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

  if (activeType === "device") {
    return restrictToWindowEdges(args);
  }

  return args.transform;
};
