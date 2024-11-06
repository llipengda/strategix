interface CardProps {
  children: React.ReactNode
  full?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({ children, full, className }) => {
  return (
    <div
      className={`p-6 ${full ? 'w-fit h-full bg-transparent' : 'shadow-lg rounded-lg max-w-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-white dark:bg-black'} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
