import "./index.scss"

type ButtonItemProps = {
  text: string;
  background?: string;
  color?: string;
  disabled?: boolean;
  action?: () => void;
};

export default function Button({
  text,
  background,
  color,
  disabled,
  action,
}: ButtonItemProps): JSX.Element {

  const handleAction = () => {
    action && action();
  };

  return (
    <button
      style={{
        background: background ? background : '#000000',
        color: color ? color : '#FFFFFF',
      }}
      onClick={handleAction}
      className={`${disabled ? 'disabled' : ''} buttonClass`}
    >
      <p>{text}</p>
    </button>
  );
};
