import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-3 py-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-zinc-400 hover:bg-primary hover:text-white disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-zinc-400 transition-all duration-300 shadow-xl"
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
      </button>

      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-12 h-12 rounded-2xl text-[13px] font-black transition-all duration-300 border ${
            currentPage === number
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110"
              : "bg-white/5 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-zinc-400 hover:bg-primary hover:text-white disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:text-zinc-400 transition-all duration-300 shadow-xl"
        aria-label="Next page"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
