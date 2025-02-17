import { Typography, TypographyProps } from "@mui/material";
import { FieldError } from "react-hook-form";

export const MessageError: FC<
  {
    field: FieldError;
  } & TypographyProps
> = ({ field, ...props }) => {
  if (!field) return null;
  return (
    <Typography variant="caption" color="error" {...props}>
      {field.message}
    </Typography>
  );
};
