import { useState, useCallback, useMemo, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  title?: string;
  btnConfirm?: string;
  btnCancel?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export const useDialog = ({
  title = "Confirmation",
  btnConfirm = "Yes",
  btnCancel = "Cancel",
  onConfirm,
  onClose,
  maxWidth = "sm",
  fullWidth = true,
}: Props): {
  open: () => void;
  close: () => void;
  content: ({ children }: { children: ReactNode }) => ReactNode;
} => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (onConfirm) onConfirm();
  }, [onConfirm]);

  const DialogComponent = useMemo(
    () =>
      ({ children }: { children: ReactNode }) =>
        open ? (
          <Dialog
            open
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle variant="h5">{title}</DialogTitle>
            <DialogContent sx={{ fontSize: 18 }}>{children}</DialogContent>
            <DialogActions sx={{ px: 2.5, pb: 2.25, pt: 0.5, gap: 0.5 }}>
              <Button
                onClick={handleConfirm}
                color="primary"
                variant="contained"
                disableElevation
                sx={{ minWidth: 80 }}
              >
                {btnConfirm}
              </Button>
              <Button
                onClick={handleClose}
                disableElevation
                variant="outlined"
                sx={{ minWidth: 80 }}
              >
                {btnCancel}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null,
    [open, handleClose, handleConfirm, title, btnConfirm, btnCancel]
  );

  return {
    open: handleOpen,
    close: handleClose,
    content: DialogComponent,
  };
};
