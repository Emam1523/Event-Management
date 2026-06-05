// Spinner.jsx - Loading spinner component
const Spinner = ({
  size = 'w-6 h-6',
  color = 'border-primary-600',
  className = ''
}) => {
  return (
    <div className={`${size} ${className}`}>
      <div className={`w-full h-full border-2 ${color} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;
