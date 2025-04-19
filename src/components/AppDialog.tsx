import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Props {
  title: string;
  body: React.ReactNode;
  cancelDialog?: () => void;
  okDialog: () => void;
  trigger: React.ReactNode;
}

const AppDialog = ({ title, trigger, okDialog, body, cancelDialog }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            {title}
          </AlertDialogDescription>
          {body}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={cancelDialog}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={okDialog}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AppDialog;
