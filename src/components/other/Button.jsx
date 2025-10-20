import './Button.css';

function Button({ text, onClick, type = "primary" }) {
  return (
    <button 
      className={`btn btn-${type}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;