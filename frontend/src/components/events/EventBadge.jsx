const EventBadge = ({ type, children, className = '' }) => {
  const variants = {
    category: 'badge-primary',
    status_confirmed: 'badge-success',
    status_pending: 'badge-warning',
    status_cancelled: 'badge-danger',
    tag: 'badge-gray'
  };

  return (
    <span className={`${variants[type] || variants.tag} ${className}`}>
      {children}
    </span>
  );
};

export default EventBadge;
