interface CardProps {
  children: React.ReactNode
  hoverAnimation?: boolean
  full?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({
  children,
  full,
  className,
  hoverAnimation = true
}) => {
  return (
    <div
      className={`p-6 ${full ? 'w-fit h-full bg-transparent' : `shadow-lg rounded-lg max-w-lg transition-all duration-300 ease-in-out ${hoverAnimation ? 'md:hover:scale-105 md:hover:shadow-2xl' : ''} bg-white dark:bg-black`} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
