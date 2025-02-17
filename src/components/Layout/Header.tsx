import { actions, useStoreUser } from "../../lib/store";
import { BoxFlex } from "../Custom";
import { colors, IconButton, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import { useDialog } from "../Dialog";
import { useDispatch } from "react-redux";

export const Header = () => {
  const dispatch = useDispatch();
  const user = useStoreUser();

  const dialog = useDialog({
    onConfirm() {
      dispatch(actions.clearSession());
    },
  });

  return (
    <BoxFlex
      alignItems="center"
      py={1.5}
      borderBottom={`1px solid ${colors.grey[200]}`}
    >
      <dialog.content>{"Apaka kamu ingin logout ?"}</dialog.content>

      <BoxFlex height={36}>
        <img src="/logo.png" alt="logo" />
      </BoxFlex>
      <BoxFlex flex={1} gap={1.75} justifyContent="flex-end">
        <BoxFlex column pt={.25}>
          <Typography variant="h3" fontSize={16}>
            {user.name}
          </Typography>
          <Typography variant="caption"  >{user.email}</Typography>
        </BoxFlex>

        <IconButton
          color="primary"
          onClick={dialog.open}
          sx={{ border: 1.5, borderColor: "primary.main" }}
        >
          <LogOut  />
        </IconButton>
      </BoxFlex>
    </BoxFlex>
  );
};
