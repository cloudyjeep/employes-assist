import {
  Box,
  BoxProps as BoxPropsMui,
  colors,
  Typography,
} from "@mui/material";
import { forwardRef, ReactNode } from "react";
import { useIsMobile } from "../lib/hook";

type BoxProps = {
  column?: boolean;
} & Omit<BoxPropsMui, "ref">;

const resolveBoxProps = (props: BoxProps): BoxProps => ({
  ...props,
  display: "flex",
  column: undefined,
  flexDirection: props.column ? "column" : undefined,
});

export const BoxFlex: FC<BoxProps> = ({ component = "div", ...props }) => (
  <Box {...resolveBoxProps(props as BoxProps)} component={component} />
);

export const BoxFlexRef = forwardRef<any, Props<BoxProps>>(
  ({ component = "div", ...props }, ref) => (
    <Box
      {...resolveBoxProps(props as BoxProps)}
      component={component}
      ref={ref}
    />
  )
);

export const Section: FC<{
  title: string | ReactNode; 
  desc: string;
  action: ReactNode;
}> = ({ title, desc, action, children }) => {
  const mobile = useIsMobile();

  return (
    <>
      {title && (
        <BoxFlex alignItems="center">
          <BoxFlex column flex={1}>
            {title && (
              <Typography variant="h2" fontSize={22}>
                {title}
              </Typography>
            )}
            {desc && (
              <Typography variant="caption" fontSize={16} fontWeight={300}>
                {desc}
              </Typography>
            )}
          </BoxFlex>
          {action && <BoxFlex>{action}</BoxFlex>}
        </BoxFlex>
      )}

      <BoxFlex
        column
        // bgcolor={colors.indigo[50]}
        // border={`1px sol`}
        boxShadow={mobile ? 0 : 1}
        py={2}
        px={2}
        pb={3}
        borderRadius={mobile ? 0 : 3}
        mx={mobile ? -1.75 : 0}
        borderTop={mobile ? `1px solid ${colors.grey[300]}` : undefined}
        bgcolor="rgb(242 246 255 / 34%)"
      >
        {children}
      </BoxFlex>
    </>
  );
};
