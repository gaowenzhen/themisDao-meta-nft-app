import { Box, Button, Dialog } from "@material-ui/core";
import React, { FC, useMemo } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

interface AlertBaseProps {
  title?: string;
  content?: string | React.ReactNode;
  closeText?: string;
  isClose?: boolean;
}
interface AlertDialogProps extends AlertBaseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
}
interface AlertProps extends AlertBaseProps {
    onCancel?: () => void;
}

export const useAlert = (props: AlertProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const View = useMemo(() => {
      return <AlertDialog
      {...{
        open,
        setOpen,
        ...props,
      }}
    />
  }, [open])

  return {
    View,
    handleClose,
    handleClickOpen,
  };
};
export const AlertDialog: FC<AlertDialogProps> = ({
  open,
  setOpen,
  isClose = true,
  title,
  content,
  closeText,
  ...reset
}) => {
  const handleClose = () => {
    setTimeout(() => {
      setOpen(false);
      reset?.onCancel?.()
    }, 200);
  };
  return (
    <Dialog
      open={open}
    //   onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{borderRadius: '18px'}}
    >
      <Box style={{display: 'flex', justifyContent: 'center', paddingTop: 35, fontSize: 20, fontWeight: 500}}>{title}</Box>
      <Box style={{ padding: 32, paddingTop: 20, boxSizing: "border-box" }}>
        {content}
        <Box style={{ display: 'flex', justifyContent: 'center', }}>
            <Box style={{ width: 219}}>
            {isClose && (
                <Button
                fullWidth
                onClick={handleClose}
                variant="contained"
                color="primary"
                >
                {closeText}
                </Button>
            )}
            </Box>
        </Box>
      </Box>
    </Dialog>
  );
};
