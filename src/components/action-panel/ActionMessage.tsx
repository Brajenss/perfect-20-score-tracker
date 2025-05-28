
interface ActionMessageProps {
  message: string;
}

const ActionMessage = ({ message }: ActionMessageProps) => {
  return (
    <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {message}
    </p>
  );
};

export default ActionMessage;
