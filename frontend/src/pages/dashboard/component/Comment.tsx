/**
 * Comment Component
 */
interface CommentProps {
  author: string;
  content: string;
  date: string;
  avatar?: string;
}

const Comment = ({ author, content, date, avatar }: CommentProps) => (
  <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-white/5 border-l-2 border-accent-gold/30 hover:border-accent-gold transition-colors">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
      {avatar ? (
        <img src={avatar} alt={author} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg font-heading font-bold text-accent-gold/40">
          {author.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white uppercase tracking-wider">
          {author}
        </span>
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
          {date}
        </span>
      </div>
      <p className="text-sm text-white/60 leading-relaxed font-serif italic">
        "{content}"
      </p>
    </div>
  </div>
);

export default Comment;
