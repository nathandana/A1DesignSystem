import { Snackbar } from "./Snackbar.jsx";

export default {
  title: "Components/Snackbar",
  component: Snackbar,
};

export const Default = {
  render: () => (
    <Snackbar open actionLabel="Undo" onAction={() => {}} onClose={() => {}}>
      Guide deleted.
    </Snackbar>
  ),
};

export const Success = {
  render: () => (
    <Snackbar open variant="success" actionLabel="Undo" onAction={() => {}}>
      Guide deleted.
    </Snackbar>
  ),
};
